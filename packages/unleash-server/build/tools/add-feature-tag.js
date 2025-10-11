import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    featureName: z.string().min(1).describe("Name of the feature flag"),
    type: z.string().describe("Tag type"),
    value: z.string().describe("Tag value"),
    color: z
        .string()
        .optional()
        .describe("Tag color in hex format (e.g., #FFFFFF)"),
});
async function handler(client, args) {
    try {
        const { instance, featureName, type, value, color } = args;
        const unleashInstance = client.getInstance(instance);
        const tagData = {
            type,
            value,
            ...(color && { color }),
        };
        const result = await client.makeRequest(unleashInstance, `/features/${featureName}/tags`, {
            method: "POST",
            body: tagData,
        });
        if (!result) {
            return createErrorResponse("Failed to add tag to feature flag");
        }
        return createSuccessResponse(`✅ Tag '${type}:${value}' added to feature flag '${featureName}' in ${instance}`);
    }
    catch (error) {
        console.error("Error adding tag to feature:", error);
        return createErrorResponse(`Failed to add tag to feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const addFeatureTagTool = {
    name: "add_feature_tag",
    description: "Add a tag to a feature flag. Tags help organize and categorize features. Note: The tag type must already exist in Unleash - use list_tag_types to see available types.",
    schema,
    handler,
};
//# sourceMappingURL=add-feature-tag.js.map