import { createErrorResponse, createSuccessResponse, ConfirmationSchema, } from "@mcp-toolbox/shared";
import { z } from "zod";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    featureName: z.string().min(1).describe("Name of the feature flag"),
    environment: z.string().describe("Environment name"),
    strategyId: z.string().describe("Strategy ID to delete"),
    project: z
        .string()
        .optional()
        .describe("Project name (uses instance default if not specified)"),
    confirmed: ConfirmationSchema,
});
async function handler(client, args) {
    try {
        const { instance, featureName, environment, strategyId, project, confirmed, } = args;
        const unleashInstance = client.getInstance(instance);
        const projectName = client.getProjectName(unleashInstance, project);
        if (unleashInstance.environments &&
            unleashInstance.environments.length > 0) {
            if (!unleashInstance.environments.includes(environment)) {
                return createErrorResponse(`Environment '${environment}' is not configured for instance '${instance}'. Available environments: ${unleashInstance.environments.join(", ")}`);
            }
        }
        if (!confirmed) {
            return createErrorResponse(`⚠️  CONFIRMATION REQUIRED

You are about to DELETE a strategy:
- Feature: ${featureName}
- Environment: ${environment}
- Strategy ID: ${strategyId}
- Instance: ${instance}
- Project: ${projectName}

This will permanently remove this strategy from the feature flag.

To proceed, call this tool again with confirmed=true`);
        }
        const result = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${featureName}/environments/${environment}/strategies/${strategyId}`, {
            method: "DELETE",
        });
        if (!result) {
            return createErrorResponse("Failed to delete strategy from feature flag");
        }
        return createSuccessResponse(`✅ Strategy '${strategyId}' deleted from feature flag '${featureName}' in ${environment} environment (${instance} - ${projectName} project)`);
    }
    catch (error) {
        console.error("Error deleting strategy from feature:", error);
        return createErrorResponse(`Failed to delete strategy from feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const deleteFeatureStrategyTool = {
    name: "delete_feature_strategy",
    description: "Delete a strategy from a feature flag in a specific environment. REQUIRES USER CONFIRMATION: You must call this tool twice - first without confirmed parameter to see what will happen, then ask the user to confirm, then call again with confirmed=true.",
    schema,
    handler,
};
//# sourceMappingURL=delete-feature-strategy.js.map