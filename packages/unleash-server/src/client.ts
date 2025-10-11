import { makeApiRequest } from "@mcp-toolbox/shared";
import type { UnleashConfig, UnleashInstance } from "./config/types.js";

export class UnleashClient {
	constructor(private config: UnleashConfig) {}

	getInstance(instanceName: string): UnleashInstance {
		const instance = this.config.instances.find(
			(i: UnleashInstance) => i.name === instanceName,
		);
		if (!instance) {
			throw new Error(
				`Unknown Unleash instance: ${instanceName}. Available instances: ${this.config.instances.map((i: UnleashInstance) => i.name).join(", ")}`,
			);
		}
		return instance;
	}

	getProjectName(instance: UnleashInstance, project?: string): string {
		return project || instance.project || "default";
	}

	getEnvironmentName(
		instance: UnleashInstance,
		environment?: string,
	): string | undefined {
		if (!environment) {
			return instance.defaultEnvironment;
		}

		if (instance.environments && instance.environments.length > 0) {
			if (!instance.environments.includes(environment)) {
				throw new Error(
					`Environment '${environment}' is not configured for instance '${instance.name}'. Available environments: ${instance.environments.join(", ")}`,
				);
			}
		}

		return environment;
	}

	async makeRequest<T>(
		instance: UnleashInstance,
		endpoint: string,
		options: {
			method?: string;
			body?: unknown;
		} = {},
	): Promise<T | null> {
		const { method = "GET", body } = options;
		const url = `${instance.url.replace(/\/$/, "")}/api/admin${endpoint}`;

		return makeApiRequest<T>(url, {
			headers: {
				Authorization: instance.token,
				"Content-Type": "application/json",
			},
			timeout: instance.timeout || 10000,
			retries: instance.retries || 3,
			method,
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	getAllInstances() {
		return this.config.instances;
	}
}
