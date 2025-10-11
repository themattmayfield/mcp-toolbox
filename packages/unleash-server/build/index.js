#!/usr/bin/env node
import { createMcpServer } from "@mcp-toolbox/shared";
import { UnleashClient } from "./client.js";
import { loadConfig } from "./config/loader.js";
import { archiveFeatureTool } from "./tools/archive-feature.js";
import { createFeatureTool } from "./tools/create-feature.js";
import { getFeatureStatusTool } from "./tools/get-feature-status.js";
import { listAllFeaturesTool } from "./tools/list-all-features.js";
import { listEnvironmentsTool } from "./tools/list-environments.js";
import { listFeaturesTool } from "./tools/list-features.js";
import { listInstancesTool } from "./tools/list-instances.js";
import { toggleFeatureTool } from "./tools/toggle-feature.js";

let client;
try {
    const config = loadConfig();
    client = new UnleashClient(config);
}
catch (error) {
    console.error("❌ Configuration Error:", error instanceof Error ? error.message : error);
    console.log("\n💡 To set up your Unleash instances, run:");
    console.log("   bun run setup");
    console.log("\nOr set environment variables:");
    console.log("   export UNLEASH_URL=https://your-unleash.com");
    console.log("   export UNLEASH_TOKEN=your-admin-token");
    process.exit(1);
}
async function main() {
    const { server, start } = createMcpServer({
        name: "unleash-server",
        version: "1.0.0",
        description: "MCP server for managing Unleash feature flags across multiple instances and environments",
    });
    server.tool(listInstancesTool.name, listInstancesTool.description, listInstancesTool.schema.shape, async () => listInstancesTool.handler(client));
    server.tool(createFeatureTool.name, createFeatureTool.description, createFeatureTool.schema.shape, async (args) => createFeatureTool.handler(client, args));
    server.tool(archiveFeatureTool.name, archiveFeatureTool.description, archiveFeatureTool.schema.shape, async (args) => archiveFeatureTool.handler(client, args));
    server.tool(listFeaturesTool.name, listFeaturesTool.description, listFeaturesTool.schema.shape, async (args) => listFeaturesTool.handler(client, args));
    server.tool(getFeatureStatusTool.name, getFeatureStatusTool.description, getFeatureStatusTool.schema.shape, async (args) => getFeatureStatusTool.handler(client, args));
    server.tool(toggleFeatureTool.name, toggleFeatureTool.description, toggleFeatureTool.schema.shape, async (args) => toggleFeatureTool.handler(client, args));
    server.tool(listEnvironmentsTool.name, listEnvironmentsTool.description, listEnvironmentsTool.schema.shape, async (args) => listEnvironmentsTool.handler(client, args));
    server.tool(listAllFeaturesTool.name, listAllFeaturesTool.description, listAllFeaturesTool.schema.shape, async (args) => listAllFeaturesTool.handler(client, args));
    await start();
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map