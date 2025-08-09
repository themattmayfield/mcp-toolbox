#!/usr/bin/env bun
import { makeApiRequest } from "@mcp-toolbox/shared";
import inquirer from "inquirer";
import { generateClaudeDesktopConfig, generateEnvVariables, getUserConfigPath, loadConfigFromFile, saveConfigToFile, UnleashInstanceSchema, } from "./config.js";
class InteractiveSetup {
    instances = [];
    async run() {
        console.log("🚀 Unleash MCP Server Setup\n");
        // Check for existing configuration
        const existingConfig = loadConfigFromFile();
        if (existingConfig) {
            const action = await this.handleExistingConfig(existingConfig);
            if (action === "exit")
                return;
        }
        console.log("Let's set up your Unleash instances!");
        console.log("You can connect to multiple Unleash instances (production, staging, etc.)\n");
        // Setup first instance
        const firstInstance = await this.setupInstance("first");
        this.instances.push(firstInstance);
        // Setup additional instances
        while (await this.askAddAnother()) {
            const instance = await this.setupInstance("additional");
            this.instances.push(instance);
        }
        // Show summary and save
        await this.showSummary();
        await this.saveConfiguration();
        await this.showNextSteps();
    }
    async handleExistingConfig(config) {
        console.log(`✅ Found existing configuration with ${config.instances.length} instance(s)\n`);
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    { name: "Add a new instance", value: "add" },
                    { name: "Edit existing instances", value: "edit" },
                    { name: "Test all connections", value: "test" },
                    { name: "Reset configuration", value: "reset" },
                    { name: "Show current config", value: "show" },
                    { name: "Exit", value: "exit" },
                ],
            },
        ]);
        switch (action) {
            case "add":
                this.instances = [...config.instances];
                return "continue";
            case "edit":
                await this.editExistingInstances(config.instances);
                return "exit";
            case "test":
                await this.testAllConnections(config.instances);
                return "exit";
            case "reset":
                console.log("🔄 Resetting configuration...\n");
                return "continue";
            case "show":
                this.showCurrentConfig(config);
                return "exit";
            case "exit":
                return "exit";
            default:
                return "continue";
        }
    }
    async setupInstance(type) {
        const instanceNumber = this.instances.length + 1;
        console.log(`📋 Setting up ${type === "first" ? "your first" : `instance #${instanceNumber}`} Unleash instance\n`);
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What would you like to call this instance?",
                default: type === "first" ? "production" : undefined,
                validate: (input) => {
                    if (!input.trim())
                        return "Instance name is required";
                    if (this.instances.some((i) => i.name === input.trim())) {
                        return "An instance with this name already exists";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "url",
                message: "Unleash server URL:",
                validate: (input) => {
                    try {
                        new URL(input);
                        return true;
                    }
                    catch {
                        return "Please enter a valid URL (e.g., https://your-unleash.com)";
                    }
                },
            },
            {
                type: "password",
                name: "token",
                message: "Admin API token:",
                mask: "•",
                validate: (input) => {
                    if (!input.trim())
                        return "API token is required";
                    return true;
                },
            },
            {
                type: "input",
                name: "project",
                message: "Default project (optional):",
                default: "default",
            },
        ]);
        // Clean up the URL (remove trailing slash)
        answers.url = answers.url.replace(/\/$/, "");
        // Test connection
        console.log("\n🔍 Testing connection...");
        const testResult = await this.testConnection({
            url: answers.url,
            token: answers.token,
            project: answers.project,
        });
        if (testResult.success) {
            console.log("✅ Connected successfully!");
            if (testResult.projects && testResult.projects.length > 0) {
                console.log(`📊 Found ${testResult.projects.length} projects: ${testResult.projects.join(", ")}`);
            }
            if (testResult.environments && testResult.environments.length > 0) {
                console.log(`📊 Found ${testResult.environments.length} environments: ${testResult.environments.join(", ")}`);
            }
            if (testResult.tokenExpiry) {
                console.log(`!  Warning: Token expires ${testResult.tokenExpiry}`);
            }
        }
        else {
            console.log(`❌ Connection failed: ${testResult.error}`);
            const { retry } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "retry",
                    message: "Would you like to try again?",
                    default: true,
                },
            ]);
            if (retry) {
                return this.setupInstance(type);
            }
            else {
                console.log("!  Continuing with untested configuration...");
            }
        }
        // Validate and return instance
        const instance = UnleashInstanceSchema.parse({
            name: answers.name.trim(),
            url: answers.url,
            token: answers.token.trim(),
            project: answers.project.trim() || "default",
        });
        console.log("");
        return instance;
    }
    async testConnection(instance) {
        try {
            // Test basic connectivity and auth by listing all projects
            const response = await makeApiRequest(`${instance.url}/api/admin/projects`, {
                headers: {
                    Authorization: instance.token,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
                retries: 1,
            });
            if (!response) {
                return { success: false, error: "No response from server" };
            }
            // Extract project names
            const projects = response.projects?.map((p) => p.name || p.id) || [];
            // Test access to the specific project that will be used
            const projectName = instance.project || "default";
            const projectResponse = await makeApiRequest(`${instance.url}/api/admin/projects/${projectName}`, {
                headers: {
                    Authorization: instance.token,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
                retries: 1,
            });
            if (!projectResponse) {
                return {
                    success: false,
                    error: `Cannot access project '${projectName}' - check project name and permissions`,
                };
            }
            // Try to get environments
            let environments = [];
            try {
                const envResponse = await makeApiRequest(`${instance.url}/api/admin/environments`, {
                    headers: {
                        Authorization: instance.token,
                        "Content-Type": "application/json",
                    },
                    timeout: 5000,
                    retries: 1,
                });
                environments = envResponse?.environments?.map((e) => e.name) || [];
            }
            catch {
                // Environments endpoint might not be available, that's ok
            }
            return {
                success: true,
                projects,
                environments,
            };
        }
        catch (error) {
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // Provide more helpful error messages
            if (errorMessage.includes("401") || errorMessage.includes("403")) {
                errorMessage = "Authentication failed - check your API token";
            }
            else if (errorMessage.includes("404")) {
                errorMessage = "Server not found - check your URL";
            }
            else if (errorMessage.includes("timeout") ||
                errorMessage.includes("ECONNREFUSED")) {
                errorMessage = "Connection timeout - check your URL and network";
            }
            return { success: false, error: errorMessage };
        }
    }
    async askAddAnother() {
        console.log(`✅ Instance '${this.instances[this.instances.length - 1].name}' configured successfully!\n`);
        const { addAnother } = await inquirer.prompt([
            {
                type: "confirm",
                name: "addAnother",
                message: "Would you like to add another instance?",
                default: false,
            },
        ]);
        console.log("");
        return addAnother;
    }
    async showSummary() {
        console.log("📋 Configuration Summary\n");
        for (const instance of this.instances) {
            console.log(`Instance: ${instance.name}`);
            console.log(`  URL: ${instance.url}`);
            console.log(`  Project: ${instance.project}`);
            console.log(`  Status: ✅ Ready\n`);
        }
        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: "Save this configuration?",
                default: true,
            },
        ]);
        if (!confirm) {
            console.log("❌ Setup cancelled.");
            process.exit(0);
        }
    }
    async saveConfiguration() {
        const config = { instances: this.instances };
        const { saveMethod } = await inquirer.prompt([
            {
                type: "list",
                name: "saveMethod",
                message: "💾 Where would you like to save the configuration?",
                choices: [
                    {
                        name: `Config file (${getUserConfigPath()}) [Recommended]`,
                        value: "file",
                    },
                    {
                        name: "Environment file (.env in current directory)",
                        value: "env",
                    },
                    {
                        name: "Show environment variables (copy/paste)",
                        value: "show-env",
                    },
                    {
                        name: "Show Claude Desktop config (copy/paste)",
                        value: "show-claude",
                    },
                ],
            },
        ]);
        switch (saveMethod) {
            case "file":
                saveConfigToFile(config);
                console.log(`\n✅ Configuration saved to ${getUserConfigPath()}`);
                break;
            case "env": {
                const envContent = generateEnvVariables(config);
                require("node:fs").writeFileSync(".env", envContent);
                console.log("\n✅ Configuration saved to .env file");
                break;
            }
            case "show-env":
                console.log("\n📋 Environment Variables:");
                console.log("```bash");
                console.log(generateEnvVariables(config));
                console.log("```");
                break;
            case "show-claude":
                console.log("\n📋 Claude Desktop Configuration:");
                console.log("```json");
                console.log(generateClaudeDesktopConfig(config));
                console.log("```");
                break;
        }
    }
    async showNextSteps() {
        console.log("\n🎉 Setup complete! Your Unleash MCP server is ready to use.\n");
        console.log("📋 Next steps:");
        console.log("1. Add to your Claude Desktop config:");
        console.log("   {");
        console.log('     "mcpServers": {');
        console.log('       "unleash": {');
        console.log('         "command": "npx",');
        console.log('         "args": ["@mcp-toolbox/unleash-server"]');
        console.log("       }");
        console.log("     }");
        console.log("   }");
        console.log("");
        console.log("2. Restart Claude Desktop");
        console.log("");
        console.log("3. Try these commands:");
        console.log("   - list_instances");
        console.log(`   - list_features instance="${this.instances[0].name}"`);
        console.log(`   - create_feature instance="${this.instances[0].name}" name="test-feature"`);
    }
    async editExistingInstances(_instances) {
        // TODO: Implement editing existing instances
        console.log("🚧 Editing existing instances is not yet implemented.");
        console.log("For now, you can delete the config file and run setup again.");
    }
    async testAllConnections(instances) {
        console.log("🔍 Testing all connections...\n");
        for (const instance of instances) {
            console.log(`Testing ${instance.name}...`);
            const result = await this.testConnection({
                url: instance.url,
                token: instance.token,
                project: instance.project,
            });
            if (result.success) {
                console.log(`✅ ${instance.name}: Connected successfully`);
                if (result.projects) {
                    console.log(`   📊 ${result.projects.length} projects found`);
                }
            }
            else {
                console.log(`❌ ${instance.name}: ${result.error}`);
            }
        }
        console.log("");
    }
    showCurrentConfig(config) {
        console.log("📋 Current Configuration:\n");
        console.log(JSON.stringify(config, null, 2));
        console.log("");
    }
}
// CLI entry point
async function main() {
    try {
        const setup = new InteractiveSetup();
        await setup.run();
    }
    catch (error) {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    }
}
// Only run if this file is executed directly
if (import.meta.main) {
    main();
}
export { InteractiveSetup };
//# sourceMappingURL=setup.js.map