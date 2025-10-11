import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
});

type TagType = {
	name: string;
	description?: string;
	icon?: string;
};

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance } = args;
		const unleashInstance = client.getInstance(instance);

		const result = await client.makeRequest<{ tagTypes: TagType[] }>(
			unleashInstance,
			"/tag-types",
		);

		if (!result || !result.tagTypes) {
			return createErrorResponse("Failed to get tag types");
		}

		if (result.tagTypes.length === 0) {
			return createSuccessResponse(`📋 No tag types found in ${instance}`);
		}

		const typeList = result.tagTypes
			.map(
				(type) =>
					`  • ${type.name}${type.description ? ` - ${type.description}` : ""}`,
			)
			.join("\n");

		return createSuccessResponse(
			`📋 Available tag types in ${instance}:\n${typeList}`,
		);
	} catch (error) {
		console.error("Error getting tag types:", error);
		return createErrorResponse(
			`Failed to get tag types: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const listTagTypesTool = {
	name: "list_tag_types",
	description:
		"List all available tag types in an Unleash instance. Tag types must exist before they can be used when adding tags to features.",
	schema,
	handler,
};
