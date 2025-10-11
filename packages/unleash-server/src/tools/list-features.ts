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
	environment: z
		.string()
		.optional()
		.describe("Environment name (optional filter)"),
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, project, environment } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);
		const envName = client.getEnvironmentName(unleashInstance, environment);

		let endpoint = `/projects/${projectName}/features`;
		if (envName) {
			endpoint += `?environment=${envName}`;
		}

		const response = await client.makeRequest<UnleashFeaturesResponse>(
			unleashInstance,
			endpoint,
		);

		if (!response) {
			return createErrorResponse("Failed to fetch feature flags");
		}

		const formattedList = formatFeatureList(response.features, envName);
		const header = `Feature flags in ${instance} (${projectName} project)${envName ? ` - ${envName} environment` : ""}:\n\n`;

		return createSuccessResponse(header + formattedList);
	} catch (error) {
		console.error("Error listing features:", error);
		return createErrorResponse(
			`Failed to list feature flags: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const listFeaturesTool = {
	name: "list_features",
	description:
		"List feature flags in an Unleash instance. Uses the instance's default environment to show environment-specific status. This is the main tool for viewing feature flags.",
	schema,
	handler,
};
