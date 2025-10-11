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
    name: z
        .string()
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
        const { instance, featureName, environment, name, title, disabled, sortOrder, parameters, constraints, variants, segments, project, } = args;
        const unleashInstance = client.getInstance(instance);
        const projectName = client.getProjectName(unleashInstance, project);
        if (unleashInstance.environments &&
            unleashInstance.environments.length > 0) {
            if (!unleashInstance.environments.includes(environment)) {
                return createErrorResponse(`Environment '${environment}' is not configured for instance '${instance}'. Available environments: ${unleashInstance.environments.join(", ")}`);
            }
        }
        const strategyData = {
            name,
            ...(title && { title }),
            ...(disabled !== undefined && { disabled }),
            ...(sortOrder !== undefined && { sortOrder }),
            ...(parameters && { parameters }),
            ...(constraints && { constraints }),
            ...(variants && { variants }),
            ...(segments && { segments }),
        };
        const result = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${featureName}/environments/${environment}/strategies`, {
            method: "POST",
            body: strategyData,
        });
        if (!result) {
            return createErrorResponse("Failed to add strategy to feature flag");
        }
        return createSuccessResponse(`✅ Strategy '${name}'${title ? ` (${title})` : ""} added to feature flag '${featureName}' in ${environment} environment (${instance} - ${projectName} project)`);
    }
    catch (error) {
        console.error("Error adding strategy to feature:", error);
        return createErrorResponse(`Failed to add strategy to feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const addFeatureStrategyTool = {
    name: "add_feature_strategy",
    description: "Add a strategy to a feature flag in a specific environment. Strategies control how and when features are enabled (e.g., gradual rollout, targeting).",
    schema,
    handler,
};
//# sourceMappingURL=add-feature-strategy.js.map