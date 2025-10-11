import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
const constraintSchema = z.object({
    contextName: z.string(),
    operator: z.string(),
    values: z.array(z.string()).optional(),
    value: z.string().optional(),
    inverted: z.boolean().optional(),
    caseInsensitive: z.boolean().optional(),
});
const variantPayloadSchema = z.object({
    type: z.string(),
    value: z.string(),
});
const variantSchema = z.object({
    name: z.string(),
    weight: z.number(),
    weightType: z.string().optional(),
    stickiness: z.string().optional(),
    payload: variantPayloadSchema.optional(),
});
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    featureName: z.string().min(1).describe("Name of the feature flag"),
    environment: z.string().describe("Environment name"),
    strategyId: z.string().describe("Strategy ID to update"),
    name: z
        .string()
        .optional()
        .describe("Strategy name (e.g., 'default', 'flexibleRollout')"),
    title: z.string().optional().describe("Strategy title"),
    disabled: z.boolean().optional().describe("Whether the strategy is disabled"),
    sortOrder: z.number().optional().describe("Sort order for the strategy"),
    parameters: z.record(z.unknown()).optional().describe("Strategy parameters"),
    constraints: z
        .array(constraintSchema)
        .optional()
        .describe("Strategy constraints"),
    variants: z.array(variantSchema).optional().describe("Strategy variants"),
    segments: z.array(z.number()).optional().describe("Segment IDs"),
    project: z
        .string()
        .optional()
        .describe("Project name (uses instance default if not specified)"),
});
async function handler(client, args) {
    try {
        const { instance, featureName, environment, strategyId, name, title, disabled, sortOrder, parameters, constraints, variants, segments, project, } = args;
        const unleashInstance = client.getInstance(instance);
        const projectName = client.getProjectName(unleashInstance, project);
        if (unleashInstance.environments &&
            unleashInstance.environments.length > 0) {
            if (!unleashInstance.environments.includes(environment)) {
                return createErrorResponse(`Environment '${environment}' is not configured for instance '${instance}'. Available environments: ${unleashInstance.environments.join(", ")}`);
            }
        }
        const strategyData = {
            ...(name && { name }),
            ...(title !== undefined && { title }),
            ...(disabled !== undefined && { disabled }),
            ...(sortOrder !== undefined && { sortOrder }),
            ...(parameters !== undefined && { parameters }),
            ...(constraints !== undefined && { constraints }),
            ...(variants !== undefined && { variants }),
            ...(segments !== undefined && { segments }),
        };
        const result = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${featureName}/environments/${environment}/strategies/${strategyId}`, {
            method: "PUT",
            body: strategyData,
        });
        if (!result) {
            return createErrorResponse("Failed to update strategy on feature flag");
        }
        return createSuccessResponse(`✅ Strategy '${strategyId}' updated on feature flag '${featureName}' in ${environment} environment (${instance} - ${projectName} project)`);
    }
    catch (error) {
        console.error("Error updating strategy on feature:", error);
        return createErrorResponse(`Failed to update strategy on feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const updateFeatureStrategyTool = {
    name: "update_feature_strategy",
    description: "Update a strategy on a feature flag in a specific environment. Only provide fields you want to update.",
    schema,
    handler,
};
//# sourceMappingURL=update-feature-strategy.js.map