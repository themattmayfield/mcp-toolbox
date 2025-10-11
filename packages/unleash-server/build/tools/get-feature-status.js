import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
import { formatFeature } from "../formatters.js";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    name: z.string().min(1).describe("Name of the feature flag"),
    project: z
        .string()
        .optional()
        .describe("Project name (uses instance default if not specified)"),
    environment: z
        .string()
        .optional()
        .describe("Environment name (optional filter)"),
});
async function handler(client, args) {
    try {
        const { instance, name, project, environment } = args;
        const unleashInstance = client.getInstance(instance);
        const projectName = client.getProjectName(unleashInstance, project);
        const envName = client.getEnvironmentName(unleashInstance, environment);
        const feature = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${name}`);
        if (!feature) {
            return createErrorResponse(`Feature flag '${name}' not found in ${instance} (${projectName} project)`);
        }
        let statusInfo = formatFeature(feature);
        if (envName) {
            const envData = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${name}/environments/${envName}`);
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
}
export const getFeatureStatusTool = {
    name: "get_feature_status",
    description: "Get detailed information about a specific feature flag, including its status across all environments and any configured strategies.",
    schema,
    handler,
};
//# sourceMappingURL=get-feature-status.js.map