import { createErrorResponse, createMcpServer, createSuccessResponse, makeApiRequest, } from "@mcp-toolbox/shared";
import { z } from "zod";
import { loadConfig, } from "./config.js";

// Load configuration from environment or config file
let UNLEASH_CONFIG;
try {
    UNLEASH_CONFIG = loadConfig();
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
// Validation schemas
const InstanceNameSchema = z
    .string()
    .describe("Name of the Unleash instance to use");
const FeatureNameSchema = z
    .string()
    .min(1)
    .describe("Name of the feature flag");
const ProjectNameSchema = z
    .string()
    .optional()
    .describe("Project name (uses instance default if not specified)");
const EnvironmentNameSchema = z
    .string()
    .optional()
    .describe("Environment name (optional filter)");
const CreateFeatureSchema = z.object({
    instance: InstanceNameSchema,
    name: FeatureNameSchema,
    description: z.string().optional().describe("Feature flag description"),
    type: z
        .enum(["release", "experiment", "operational", "kill-switch", "permission"])
        .default("release")
        .describe("Type of feature flag"),
    project: ProjectNameSchema,
});
const ArchiveFeatureSchema = z.object({
    instance: InstanceNameSchema,
    name: FeatureNameSchema,
    project: ProjectNameSchema,
});
const ListFeaturesSchema = z.object({
    instance: InstanceNameSchema,
    project: ProjectNameSchema,
    environment: EnvironmentNameSchema,
});
const GetFeatureStatusSchema = z.object({
    instance: InstanceNameSchema,
    name: FeatureNameSchema,
    project: ProjectNameSchema,
    environment: EnvironmentNameSchema,
});
const ToggleFeatureSchema = z.object({
    instance: InstanceNameSchema,
    name: FeatureNameSchema,
    environment: z.string().describe("Environment name"),
    enabled: z.boolean().describe("Whether to enable or disable the feature"),
    project: ProjectNameSchema,
});
// Helper functions
function getUnleashInstance(instanceName) {
    const instance = UNLEASH_CONFIG.instances.find((i) => i.name === instanceName);
    if (!instance) {
        throw new Error(`Unknown Unleash instance: ${instanceName}. Available instances: ${UNLEASH_CONFIG.instances.map((i) => i.name).join(", ")}`);
    }
    return instance;
}
function getProjectName(instance, project) {
    return project || instance.project || "default";
}
async function makeUnleashRequest(instance, endpoint, options = {}) {
    const { method = "GET", body } = options;
    const url = `${instance.url.replace(/\/$/, "")}/api/admin${endpoint}`;
    return makeApiRequest(url, {
        headers: {
            Authorization: instance.token,
            "Content-Type": "application/json",
        },
        timeout: instance.timeout || 10000,
        retries: instance.retries || 3,
        method,
        body: body ? JSON.stringify(body) : undefined,
    });
}
function formatFeature(feature) {
    const status = feature.archived
        ? "🗄 ARCHIVED"
        : feature.enabled
            ? "✅ ENABLED"
            : "❌ DISABLED";
    const envStatus = feature.environments
        .map((env) => `${env.name}: ${env.enabled ? "✅" : "❌"}`)
        .join(", ");
    return [
        `**${feature.name}** (${feature.type}) ${status}`,
        feature.description ? `Description: ${feature.description}` : "",
        `Project: ${feature.project}`,
        `Environments: ${envStatus}`,
        `Created: ${new Date(feature.createdAt).toLocaleDateString()}`,
        feature.lastSeenAt
            ? `Last seen: ${new Date(feature.lastSeenAt).toLocaleDateString()}`
            : "",
        feature.stale ? "! STALE" : "",
        "---",
    ]
        .filter(Boolean)
        .join("\n");
}
function formatFeatureList(features) {
    if (features.length === 0) {
        return "No features found.";
    }
    const summary = [
        `Found ${features.length} feature flag(s):`,
        `- Active: ${features.filter((f) => !f.archived && f.enabled).length}`,
        `- Disabled: ${features.filter((f) => !f.archived && !f.enabled).length}`,
        `- Archived: ${features.filter((f) => f.archived).length}`,
        `- Stale: ${features.filter((f) => f.stale).length}`,
        "",
    ].join("\n");
    const featureList = features.map(formatFeature).join("\n");
    return summary + featureList;
}
async function main() {
    const { server, start } = createMcpServer({
        name: "unleash-server",
        version: "1.0.0",
        description: "MCP server for managing Unleash feature flags across multiple instances and environments",
    });
    // List available instances
    server.tool("list_instances", "List all configured Unleash instances", {}, async () => {
        try {
            const instances = UNLEASH_CONFIG.instances.map((instance) => ({
                name: instance.name,
                url: instance.url,
                defaultProject: instance.project || "default",
            }));
            const instanceList = instances
                .map((i) => `**${i.name}**\n  URL: ${i.url}\n  Default Project: ${i.defaultProject}`)
                .join("\n\n");
            return createSuccessResponse(`Available Unleash instances:\n\n${instanceList}`);
        }
        catch (error) {
            console.error("Error listing instances:", error);
            return createErrorResponse("Failed to list instances");
        }
    });
    // Create a new feature flag
    server.tool("create_feature", "Create a new feature flag in an Unleash instance", CreateFeatureSchema.shape, async ({ instance, name, description, type, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const featureData = {
                name,
                description: description || "",
                type,
                impressionData: false,
            };
            const result = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features`, {
                method: "POST",
                body: featureData,
            });
            if (!result) {
                return createErrorResponse("Failed to create feature flag");
            }
            return createSuccessResponse(`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)`);
        }
        catch (error) {
            console.error("Error creating feature:", error);
            return createErrorResponse(`Failed to create feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // Archive a feature flag
    server.tool("archive_feature", "Archive a feature flag in an Unleash instance", ArchiveFeatureSchema.shape, async ({ instance, name, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const result = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}/archive`, {
                method: "DELETE",
            });
            if (!result) {
                return createErrorResponse("Failed to archive feature flag");
            }
            return createSuccessResponse(`🗄 Feature flag '${name}' archived successfully in ${instance} (${projectName} project)`);
        }
        catch (error) {
            console.error("Error archiving feature:", error);
            return createErrorResponse(`Failed to archive feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // List all feature flags
    server.tool("list_features", "List all feature flags in an Unleash instance", ListFeaturesSchema.shape, async ({ instance, project, environment }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            let endpoint = `/projects/${projectName}/features`;
            if (environment) {
                endpoint += `?environment=${environment}`;
            }
            const response = await makeUnleashRequest(unleashInstance, endpoint);
            if (!response) {
                return createErrorResponse("Failed to fetch feature flags");
            }
            const formattedList = formatFeatureList(response.features);
            const header = `Feature flags in ${instance} (${projectName} project)${environment ? ` - ${environment} environment` : ""}:\n\n`;
            return createSuccessResponse(header + formattedList);
        }
        catch (error) {
            console.error("Error listing features:", error);
            return createErrorResponse(`Failed to list feature flags: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // Get feature flag status
    server.tool("get_feature_status", "Get the status of a specific feature flag", GetFeatureStatusSchema.shape, async ({ instance, name, project, environment }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const feature = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}`);
            if (!feature) {
                return createErrorResponse(`Feature flag '${name}' not found in ${instance} (${projectName} project)`);
            }
            let statusInfo = formatFeature(feature);
            // If specific environment requested, show detailed environment status
            if (environment) {
                const envData = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}/environments/${environment}`);
                if (envData) {
                    statusInfo += `\n\n**${environment} Environment Details:**\n`;
                    statusInfo += `Status: ${envData.enabled ? "✅ ENABLED" : "❌ DISABLED"}\n`;
                    if (envData.strategies) {
                        statusInfo += `Strategies: ${envData.strategies.length} configured\n`;
                    }
                }
            }
            return createSuccessResponse(statusInfo);
        }
        catch (error) {
            console.error("Error getting feature status:", error);
            return createErrorResponse(`Failed to get feature status: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // Toggle feature flag in environment
    server.tool("toggle_feature", "Enable or disable a feature flag in a specific environment", ToggleFeatureSchema.shape, async ({ instance, name, environment, enabled, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const action = enabled ? "on" : "off";
            const result = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}/environments/${environment}/${action}`, {
                method: "POST",
            });
            if (!result) {
                return createErrorResponse(`Failed to ${enabled ? "enable" : "disable"} feature flag`);
            }
            const status = enabled ? "✅ ENABLED" : "❌ DISABLED";
            return createSuccessResponse(`${status} Feature flag '${name}' ${enabled ? "enabled" : "disabled"} in ${environment} environment (${instance} - ${projectName} project)`);
        }
        catch (error) {
            console.error("Error toggling feature:", error);
            return createErrorResponse(`Failed to toggle feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // List environments for an instance
    server.tool("list_environments", "List all environments in an Unleash instance", {
        instance: InstanceNameSchema,
        project: ProjectNameSchema,
    }, async ({ instance, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            // Get project-specific environments
            const response = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/environments`);
            if (!response) {
                return createErrorResponse("Failed to fetch environments");
            }
            const envList = response.environments
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((env) => `**${env.name}** (${env.type})\n  Status: ${env.enabled ? "✅ Enabled" : "❌ Disabled"}\n  Protected: ${env.protected ? "🔒 Yes" : "🔓 No"}`)
                .join("\n\n");
            return createSuccessResponse(`Environments in ${instance} (${projectName} project):\n\n${envList}`);
        }
        catch (error) {
            console.error("Error listing environments:", error);
            return createErrorResponse(`Failed to list environments: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    await start();
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map