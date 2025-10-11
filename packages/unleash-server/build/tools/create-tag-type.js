import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    name: z.string().min(1).describe("Name of the tag type"),
    description: z.string().optional().describe("Description of the tag type"),
    icon: z.string().optional().describe("Icon for the tag type"),
    color: z.string().optional().describe("Color in hex format (e.g., #FFFFFF)"),
});
async function handler(client, args) {
    try {
        const { instance, name, description, icon, color } = args;
        const unleashInstance = client.getInstance(instance);
        const tagTypeData = {
            name,
            ...(description && { description }),
            ...(icon && { icon }),
            ...(color && { color }),
        };
        const result = await client.makeRequest(unleashInstance, "/tag-types", {
            method: "POST",
            body: tagTypeData,
        });
        if (!result) {
            return createErrorResponse("Failed to create tag type");
        }
        return createSuccessResponse(`✅ Tag type '${name}' created successfully in ${instance}`);
    }
    catch (error) {
        console.error("Error creating tag type:", error);
        return createErrorResponse(`Failed to create tag type: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const createTagTypeTool = {
    name: "create_tag_type",
    description: "Create a new tag type in Unleash. Tag types must be created before they can be used when tagging features.",
    schema,
    handler,
};
//# sourceMappingURL=create-tag-type.js.map