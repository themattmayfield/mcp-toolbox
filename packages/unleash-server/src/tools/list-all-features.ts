import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";
import { formatFeatureList } from "../formatters.js";
import type { UnleashFeaturesResponse } from "../types.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	project: z
		.string()
		.optional()
		.describe("Project name (uses instance default if not specified)"),
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, project } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);

		const endpoint = `/projects/${projectName}/features`;

		const response = await client.makeRequest<UnleashFeaturesResponse>(
			unleashInstance,
			endpoint,
		);

		if (!response) {
			return createErrorResponse("Failed to fetch feature flags");
		}

		const formattedList = formatFeatureList(response.features);
		const header = `Feature flags in ${instance} (${projectName} project) - Global view across all environments:\n\n`;

		return createSuccessResponse(header + formattedList);
	} catch (error) {
		console.error("Error listing all features:", error);
		return createErrorResponse(
			`Failed to list feature flags: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const listAllFeaturesTool = {
	name: "list_all_features",
	description:
		"List feature flags with global status across all environments. Only use this when you specifically need to see global feature flag status rather than environment-specific status.",
	schema,
	handler,
};
