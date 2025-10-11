import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import { z } from "zod";
import type { UnleashClient } from "../client.js";

const schema = z.object({
	instance: z.string().describe("Name of the Unleash instance to use"),
	name: z.string().min(1).describe("Name of the feature flag"),
	description: z.string().optional().describe("Feature flag description"),
	type: z
		.enum(["release", "experiment", "operational", "kill-switch", "permission"])
		.default("release")
		.describe("Type of feature flag"),
	project: z
		.string()
		.optional()
		.describe("Project name (uses instance default if not specified)"),
});

async function handler(client: UnleashClient, args: z.infer<typeof schema>) {
	try {
		const { instance, name, description, type, project } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);

		const featureData = {
			name,
			description: description || "",
			type,
			impressionData: false,
		};

		const result = await client.makeRequest(
			unleashInstance,
			`/projects/${projectName}/features`,
			{
				method: "POST",
				body: featureData,
			},
		);

		if (!result) {
			return createErrorResponse("Failed to create feature flag");
		}

		const environments = unleashInstance.environments || [];

		if (environments.length > 0) {
			const disablePromises = environments.map(async (env) => {
				try {
					await client.makeRequest(
						unleashInstance,
						`/projects/${projectName}/features/${name}/environments/${env}/off`,
						{
							method: "POST",
						},
					);
					return { env, success: true };
				} catch (error) {
					console.error(
						`Failed to disable feature '${name}' in environment '${env}':`,
						error,
					);
					return { env, success: false, error };
				}
			});

			const results = await Promise.all(disablePromises);
			const failed = results.filter((r) => !r.success);

			if (failed.length > 0) {
				const failedEnvs = failed.map((f) => f.env).join(", ");
				return createSuccessResponse(
					`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)\n⚠️ Warning: Failed to disable in environments: ${failedEnvs}`,
				);
			}

			const envList = environments.join(", ");
			return createSuccessResponse(
				`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project) and disabled in all environments: ${envList}`,
			);
		}

		return createSuccessResponse(
			`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)`,
		);
	} catch (error) {
		console.error("Error creating feature:", error);
		return createErrorResponse(
			`Failed to create feature flag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export const createFeatureTool = {
	name: "create_feature",
	description:
		"Create a new feature flag and explicitly disable it in all configured environments for the instance. Ensures consistent environment-specific state from creation.",
	schema,
	handler,
};
