import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import type { z } from "zod";
import type { UnleashClient } from "../client.js";
import { formatFeature, formatFeatureList } from "../formatters.js";
import type {
	ArchiveFeatureSchema,
	CreateFeatureSchema,
	GetFeatureStatusSchema,
	ListFeaturesSchema,
	ToggleFeatureSchema,
} from "../schemas.js";
import type {
	UnleashFeature,
	UnleashFeatureEnvironment,
	UnleashFeaturesResponse,
} from "../types.js";

export async function createFeatureHandler(
	client: UnleashClient,
	args: z.infer<typeof CreateFeatureSchema>,
) {
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
		} else {
			return createSuccessResponse(
				`✅ Feature flag '${name}' created successfully in ${instance} (${projectName} project)`,
			);
		}
	} catch (error) {
		console.error("Error creating feature:", error);
		return createErrorResponse(
			`Failed to create feature flag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function archiveFeatureHandler(
	client: UnleashClient,
	args: z.infer<typeof ArchiveFeatureSchema>,
) {
	try {
		const { instance, name, project } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);

		const result = await client.makeRequest(
			unleashInstance,
			`/projects/${projectName}/features/${name}`,
			{
				method: "DELETE",
			},
		);

		if (!result) {
			return createErrorResponse("Failed to archive feature flag");
		}

		return createSuccessResponse(
			`🗄 Feature flag '${name}' archived successfully in ${instance} (${projectName} project)`,
		);
	} catch (error) {
		console.error("Error archiving feature:", error);
		return createErrorResponse(
			`Failed to archive feature flag: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function listFeaturesHandler(
	client: UnleashClient,
	args: z.infer<typeof ListFeaturesSchema>,
) {
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

export async function getFeatureStatusHandler(
	client: UnleashClient,
	args: z.infer<typeof GetFeatureStatusSchema>,
) {
	try {
		const { instance, name, project, environment } = args;
		const unleashInstance = client.getInstance(instance);
		const projectName = client.getProjectName(unleashInstance, project);
		const envName = client.getEnvironmentName(unleashInstance, environment);

		const feature = await client.makeRequest<UnleashFeature>(
			unleashInstance,
			`/projects/${projectName}/features/${name}`,
		);

		if (!feature) {
			return createErrorResponse(
				`Feature flag '${name}' not found in ${instance} (${projectName} project)`,
			);
		}

		let statusInfo = formatFeature(feature);

		if (envName) {
			const envData = await client.makeRequest(
				unleashInstance,
				`/projects/${projectName}/features/${name}/environments/${envName}`,
			);

			if (envData) {
				statusInfo += `\n\n**${envName} Environment Details:**\n`;
				const featureEnv = envData as UnleashFeatureEnvironment;
				statusInfo += `Status: ${featureEnv.enabled ? "✅ ENABLED" : "❌ DISABLED"}\n`;
				if (featureEnv.strategies) {
					statusInfo += `Strategies: ${featureEnv.strategies.length} configured\n`;
				}
			}
		}

		return createSuccessResponse(statusInfo);
	} catch (error) {
		console.error("Error getting feature status:", error);
		return createErrorResponse(
			`Failed to get feature status: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function toggleFeatureHandler(
	client: UnleashClient,
	args: z.infer<typeof ToggleFeatureSchema>,
) {
	try {
		const { instance, name, environment, enabled, project } = args;
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
