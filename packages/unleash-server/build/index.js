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
function getEnvironmentName(instance, environment) {
    // If no environment specified, use the instance's default environment
    if (!environment) {
        return instance.defaultEnvironment;
    }
    // If instance has configured environments, validate the requested environment
    if (instance.environments && instance.environments.length > 0) {
        if (!instance.environments.includes(environment)) {
            throw new Error(`Environment '${environment}' is not configured for instance '${instance.name}'. Available environments: ${instance.environments.join(", ")}`);
        }
    }
    return environment;
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
function formatFeature(feature, filterEnvironment) {
    let status;
    if (feature.archived) {
        status = "🗄 ARCHIVED";
    }
    else if (filterEnvironment) {
        // When filtering by environment, show the environment-specific status
        const envStatus = feature.environments.find((env) => env.name === filterEnvironment);
        status = envStatus?.enabled ? "✅ ENABLED" : "❌ DISABLED";
    }
    else {
        // When not filtering, show global status
        status = feature.enabled ? "✅ ENABLED" : "❌ DISABLED";
    }
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
        feature.stale ? "⚠️ STALE" : "",
        "---",
    ]
        .filter(Boolean)
        .join("\n");
}
function formatFeatureList(features, filterEnvironment) {
    if (features.length === 0) {
        return "No features found.";
    }
    // Calculate summary based on environment-specific status if filtering
    let activeCount, disabledCount;
    if (filterEnvironment) {
        activeCount = features.filter((f) => {
            if (f.archived)
                return false;
            const envStatus = f.environments.find((env) => env.name === filterEnvironment);
            return envStatus?.enabled || false;
        }).length;
        disabledCount = features.filter((f) => {
            if (f.archived)
                return false;
            const envStatus = f.environments.find((env) => env.name === filterEnvironment);
            return !envStatus?.enabled;
        }).length;
    }
    else {
        activeCount = features.filter((f) => !f.archived && f.enabled).length;
        disabledCount = features.filter((f) => !f.archived && !f.enabled).length;
    }
    const summary = [
        `Found ${features.length} feature flag(s):`,
        `- Active: ${activeCount}`,
        `- Disabled: ${disabledCount}`,
        `- Archived: ${features.filter((f) => f.archived).length}`,
        `- Stale: ${features.filter((f) => f.stale).length}`,
        "",
    ].join("\n");
    const featureList = features
        .map((feature) => formatFeature(feature, filterEnvironment))
        .join("\n");
    return summary + featureList;
}
async function main() {
    const { server, start } = createMcpServer({
        name: "unleash-server",
        version: "1.0.0",
        description: "MCP server for managing Unleash feature flags across multiple instances and environments",
    });
    // List available instances
    server.tool("list_instances", "Show all configured Unleash server instances (e.g., production, staging, development). Use this to see what instances are available.", {}, async () => {
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
    server.tool("create_feature", "Create a new feature flag and explicitly disable it in all configured environments for the instance. Ensures consistent environment-specific state from creation.", CreateFeatureSchema.shape, async ({ instance, name, description, type, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const featureData = {
                name,
                description: description || "",
                type,
                impressionData: false,
            };
            // Create the feature flag
            const result = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features`, {
                method: "POST",
                body: featureData,
            });
            if (!result) {
                return createErrorResponse("Failed to create feature flag");
            }
            // Get configured environments for this instance
            const environments = unleashInstance.environments || [];
            if (environments.length > 0) {
                // Explicitly disable the feature in each configured environment
                const disablePromises = environments.map(async (env) => {
                    try {
                        await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}/environments/${env}/off`, {
                            method: "POST",
                        });
                        return { env, success: true };
                    }
                    catch (error) {
                        console.error(`Failed to disable feature '${name}' in environment '${env}':`, error);
                        return { env, success: false, error };
                    }
                });
                const results = await Promise.all(disablePromises);
                const failed = results.filter((r) => !r.success);
                if (failed.length > 0) {
                    const failedEnvs = failed.map((f) => f.env).join(", ");
                    return createSuccessResponse(`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)\n⚠️ Warning: Failed to disable in environments: ${failedEnvs}`);
                }
                const envList = environments.join(", ");
                return createSuccessResponse(`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project) and disabled in all environments: ${envList}`);
            }
            else {
                return createSuccessResponse(`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)`);
            }
        }
        catch (error) {
            console.error("Error creating feature:", error);
            return createErrorResponse(`Failed to create feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // Archive a feature flag
    server.tool("archive_feature", "Archive (soft delete) a feature flag when it's no longer needed. Archived flags are hidden from normal views but can be restored if needed.", ArchiveFeatureSchema.shape, async ({ instance, name, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const result = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}`, {
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
    // List feature flags (primary tool - uses default environment)
    server.tool("list_features", "List feature flags in an Unleash instance. Uses the instance's default environment to show environment-specific status. This is the main tool for viewing feature flags.", ListFeaturesSchema.shape, async ({ instance, project, environment }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const envName = getEnvironmentName(unleashInstance, environment);
            let endpoint = `/projects/${projectName}/features`;
            if (envName) {
                endpoint += `?environment=${envName}`;
            }
            const response = await makeUnleashRequest(unleashInstance, endpoint);
            if (!response) {
                return createErrorResponse("Failed to fetch feature flags");
            }
            const formattedList = formatFeatureList(response.features, envName);
            const header = `Feature flags in ${instance} (${projectName} project)${envName ? ` - ${envName} environment` : ""}:\n\n`;
            return createSuccessResponse(header + formattedList);
        }
        catch (error) {
            console.error("Error listing features:", error);
            return createErrorResponse(`Failed to list feature flags: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    // Get feature flag status
    server.tool("get_feature_status", "Get detailed information about a specific feature flag, including its status across all environments and any configured strategies.", GetFeatureStatusSchema.shape, async ({ instance, name, project, environment }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const envName = getEnvironmentName(unleashInstance, environment);
            const feature = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}`);
            if (!feature) {
                return createErrorResponse(`Feature flag '${name}' not found in ${instance} (${projectName} project)`);
            }
            let statusInfo = formatFeature(feature);
            // If specific environment requested, show detailed environment status
            if (envName) {
                const envData = await makeUnleashRequest(unleashInstance, `/projects/${projectName}/features/${name}/environments/${envName}`);
                if (envData) {
                    statusInfo += `\n\n**${envName} Environment Details:**\n`;
                    const featureEnv = envData;
                    statusInfo += `Status: ${featureEnv.enabled ? "✅ ENABLED" : "❌ DISABLED"}\n`;
                    if (featureEnv.strategies) {
                        statusInfo += `Strategies: ${featureEnv.strategies.length} configured\n`;
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
    server.tool("toggle_feature", "Enable or disable a feature flag in a specific environment (e.g., enable in staging, disable in production). This is how you control where features are active.", ToggleFeatureSchema.shape, async ({ instance, name, environment, enabled, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            // Validate environment (required for toggle operations)
            if (unleashInstance.environments &&
                unleashInstance.environments.length > 0) {
                if (!unleashInstance.environments.includes(environment)) {
                    return createErrorResponse(`Environment '${environment}' is not configured for instance '${instance}'. Available environments: ${unleashInstance.environments.join(", ")}`);
                }
            }
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
    server.tool("list_environments", "Show all available environments (e.g., development, staging, production) for a specific Unleash instance. Use this to see what environments you can deploy features to.", {
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
    // List all feature flags across all environments (global view - rarely needed)
    server.tool("list_all_features", "List feature flags with global status across all environments. Only use this when you specifically need to see global feature flag status rather than environment-specific status.", {
        instance: InstanceNameSchema,
        project: ProjectNameSchema,
    }, async ({ instance, project }) => {
        try {
            const unleashInstance = getUnleashInstance(instance);
            const projectName = getProjectName(unleashInstance, project);
            const endpoint = `/projects/${projectName}/features`;
            const response = await makeUnleashRequest(unleashInstance, endpoint);
            if (!response) {
                return createErrorResponse("Failed to fetch feature flags");
            }
            const formattedList = formatFeatureList(response.features);
            const header = `Feature flags in ${instance} (${projectName} project) - Global view across all environments:\n\n`;
            return createSuccessResponse(header + formattedList);
        }
        catch (error) {
            console.error("Error listing all features:", error);
            return createErrorResponse(`Failed to list feature flags: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    await start();
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map