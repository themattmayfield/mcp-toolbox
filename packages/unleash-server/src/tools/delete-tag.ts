import {
	createErrorResponse,
	createSuccessResponse,
	ConfirmationSchema,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	type: z.string().describe("Tag type"),
	value: z.string().describe("Tag value"),
	confirmed: ConfirmationSchema,
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, type, value, confirmed } = args;
		const unleashInstance = client.getInstance(instance);

		if (!confirmed) {
			return createErrorResponse(`⚠️  CONFIRMATION REQUIRED

You are about to DELETE a tag:
- Tag: ${type}:${value}
- Instance: ${instance}

This will remove the tag from all features that use it.

To proceed, call this tool again with confirmed=true`);
		}

		const result = await client.makeRequest(
			unleashInstance,
			`/tags/${type}/${value}`,
			{
				method: "DELETE",
			},
		);

		if (!result) {
			return createErrorResponse("Failed to delete tag");
		}

		return createSuccessResponse(
			`✅ Tag '${type}:${value}' deleted successfully from ${instance}`,
		);
	} catch (error) {
		console.error("Error deleting tag:", error);
		return createErrorResponse(
			`Failed to delete tag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const deleteTagTool = {
	name: "delete_tag",
	description:
		"Delete a tag from Unleash. This removes the tag from all features that use it. REQUIRES USER CONFIRMATION: You must call this tool twice - first without confirmed parameter to see what will happen, then ask the user to confirm, then call again with confirmed=true.",
	schema,
	handler,
};
