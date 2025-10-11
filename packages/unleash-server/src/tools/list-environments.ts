import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";
import type { UnleashEnvironmentsResponse } from "../types.js";

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

		const response = await client.makeRequest<UnleashEnvironmentsResponse>(
			unleashInstance,
			`/projects/${projectName}/environments`,
		);

		if (!response) {
			return createErrorResponse("Failed to fetch environments");
		}

		const envList = response.environments
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.map(
				(env) =>
					`**${env.name}** (${env.type})\n  Status: ${env.enabled ? "✅ Enabled" : "❌ Disabled"}\n  Protected: ${env.protected ? "🔒 Yes" : "🔓 No"}`,
			)
			.join("\n\n");

		return createSuccessResponse(
			`Environments in ${instance} (${projectName} project):\n\n${envList}`,
		);
	} catch (error) {
		console.error("Error listing environments:", error);
		return createErrorResponse(
			`Failed to list environments: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const listEnvironmentsTool = {
	name: "list_environments",
	description:
		"Show all available environments (e.g., development, staging, production) for a specific Unleash instance. Use this to see what environments you can deploy features to.",
	schema,
	handler,
};
