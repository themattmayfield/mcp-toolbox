import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import type { z } from "zod";
import type { UnleashClient } from "../client.js";
import { formatFeatureList } from "../formatters.js";
import type {
	ListAllFeaturesSchema,
	ListEnvironmentsSchema,
} from "../schemas.js";
import type {
	UnleashEnvironmentsResponse,
	UnleashFeaturesResponse,
} from "../types.js";

export async function listEnvironmentsHandler(
	client: UnleashClient,
	args: z.infer<typeof ListEnvironmentsSchema>,
) {
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

export async function listAllFeaturesHandler(
	client: UnleashClient,
	args: z.infer<typeof ListAllFeaturesSchema>,
) {
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
