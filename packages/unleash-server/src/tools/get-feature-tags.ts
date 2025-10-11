import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	featureName: z.string().min(1).describe("Name of the feature flag"),
});

type Tag = {
	type: string;
	value: string;
	color?: string;
};

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, featureName } = args;
		const unleashInstance = client.getInstance(instance);

		const result = await client.makeRequest<{ tags: Tag[] }>(
			unleashInstance,
			`/features/${featureName}/tags`,
		);

		if (!result) {
			return createErrorResponse("Failed to get tags for feature flag");
		}

		if (!result.tags || result.tags.length === 0) {
			return createSuccessResponse(
				`📋 No tags found for feature flag '${featureName}' in ${instance}`,
			);
		}

		const tagList = result.tags
			.map(
				(tag) =>
					`  • ${tag.type}:${tag.value}${tag.color ? ` (${tag.color})` : ""}`,
			)
			.join("\n");

		return createSuccessResponse(
			`📋 Tags for feature flag '${featureName}' in ${instance}:\n${tagList}`,
		);
	} catch (error) {
		console.error("Error getting tags for feature:", error);
		return createErrorResponse(
			`Failed to get tags for feature flag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const getFeatureTagsTool = {
	name: "get_feature_tags",
	description: "Get all tags for a feature flag.",
	schema,
	handler,
};
