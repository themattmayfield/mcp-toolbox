import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	name: z.string().min(1).describe("Name of the tag type to delete"),
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, name } = args;
		const unleashInstance = client.getInstance(instance);

		const result = await client.makeRequest(
			unleashInstance,
			`/tag-types/${name}`,
			{
				method: "DELETE",
			},
		);

		if (!result) {
			return createErrorResponse("Failed to delete tag type");
		}

		return createSuccessResponse(
			`✅ Tag type '${name}' deleted successfully from ${instance}`,
		);
	} catch (error) {
		console.error("Error deleting tag type:", error);
		return createErrorResponse(
			`Failed to delete tag type: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const deleteTagTypeTool = {
	name: "delete_tag_type",
	description:
		"Delete a tag type from Unleash. Note: You cannot delete a tag type that is currently in use.",
	schema,
	handler,
};
