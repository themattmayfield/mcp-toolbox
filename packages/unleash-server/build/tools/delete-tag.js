import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    type: z.string().describe("Tag type"),
    value: z.string().describe("Tag value"),
});
async function handler(client, args) {
    try {
        const { instance, type, value } = args;
        const unleashInstance = client.getInstance(instance);
        const result = await client.makeRequest(unleashInstance, `/tags/${type}/${value}`, {
            method: "DELETE",
        });
        if (!result) {
            return createErrorResponse("Failed to delete tag");
        }
        return createSuccessResponse(`✅ Tag '${type}:${value}' deleted successfully from ${instance}`);
    }
    catch (error) {
        console.error("Error deleting tag:", error);
        return createErrorResponse(`Failed to delete tag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const deleteTagTool = {
    name: "delete_tag",
    description: "Delete a tag from Unleash. This removes the tag from all features that use it.",
    schema,
    handler,
};
//# sourceMappingURL=delete-tag.js.map