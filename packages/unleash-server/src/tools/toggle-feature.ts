import {
	createErrorResponse,
	createSuccessResponse,
	ConfirmationSchema,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	name: z.string().min(1).describe("Name of the feature flag"),
	environment: z.string().describe("Environment name"),
	enabled: z.boolean().describe("Whether to enable or disable the feature"),
	project: z
		.string()
		.optional()
		.describe("Project name (uses instance default if not specified)"),
	confirmed: ConfirmationSchema,
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, name, environment, enabled, project, confirmed } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);

		if (
			unleashInstance.environments &&
			unleashInstance.environments.length > 0
		) {
			if (!unleashInstance.environments.includes(environment)) {
				return createErrorResponse(
					`Environment '${environment}' is not configured for instance '${instance}'. Available environments: ${unleashInstance.environments.join(", ")}`,
				);
			}
		}

		if (!confirmed) {
			const actionVerb = enabled ? "enable" : "disable";
			return createErrorResponse(`⚠️  CONFIRMATION REQUIRED

You are about to ${actionVerb.toUpperCase()} a feature flag:
- Feature: ${name}
- Environment: ${environment}
- Instance: ${instance}
- Project: ${projectName}

This will ${enabled ? "activate" : "deactivate"} this feature for users in the ${environment} environment.

To proceed, call this tool again with confirmed=true`);
		}

		const action = enabled ? "on" : "off";
		const result = await client.makeRequest(
			unleashInstance,
			`/projects/${projectName}/features/${name}/environments/${environment}/${action}`,
			{
				method: "POST",
			},
		);

		if (!result) {
			return createErrorResponse(
				`Failed to ${enabled ? "enable" : "disable"} feature flag`,
			);
		}

		const status = enabled ? "✅ ENABLED" : "❌ DISABLED";
		return createSuccessResponse(
			`${status} Feature flag '${name}' ${enabled ? "enabled" : "disabled"} in ${environment} environment (${instance} - ${projectName} project)`,
		);
	} catch (error) {
		console.error("Error toggling feature:", error);
		return createErrorResponse(
			`Failed to toggle feature flag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const toggleFeatureTool = {
	name: "toggle_feature",
	description:
		"Enable or disable a feature flag in a specific environment (e.g., enable in staging, disable in production). This is how you control where features are active. REQUIRES USER CONFIRMATION: You must call this tool twice - first without confirmed parameter to see what will happen, then ask the user to confirm, then call again with confirmed=true.",
	schema,
	handler,
};
