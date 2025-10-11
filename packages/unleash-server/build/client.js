/**
 * Unleash API client for making authenticated requests to Unleash servers.
 *
 * Provides methods to:
 * - Retrieve configured Unleash instances
 * - Resolve project and environment names with defaults
 * - Make authenticated API requests to Unleash Admin API
 *
 * All tools use this client to interact with Unleash servers.
 */
import { makeApiRequest } from "@mcp-toolbox/shared";
export class UnleashClient {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Get an Unleash instance by name.
     * @throws Error if instance name is not found
     */
    getInstance(instanceName) {
        const instance = this.config.instances.find((i) => i.name === instanceName);
        if (!instance) {
            throw new Error(`Unknown Unleash instance: ${instanceName}. Available instances: ${this.config.instances.map((i) => i.name).join(", ")}`);
        }
        return instance;
    }
    /**
     * Resolve project name, using instance default or "default" as fallback.
     */
    getProjectName(instance, project) {
        return project || instance.project || "default";
    }
    /**
     * Resolve environment name, using instance default if not specified.
     * @throws Error if environment is specified but not configured for the instance
     */
    getEnvironmentName(instance, environment) {
        if (!environment) {
            return instance.defaultEnvironment;
        }
        if (instance.environments && instance.environments.length > 0) {
            if (!instance.environments.includes(environment)) {
                throw new Error(`Environment '${environment}' is not configured for instance '${instance.name}'. Available environments: ${instance.environments.join(", ")}`);
            }
        }
        return environment;
    }
    /**
     * Make an authenticated API request to an Unleash instance.
     * @returns Response data or null if request fails
     */
    async makeRequest(instance, endpoint, options = {}) {
        const { method = "GET", body } = options;
        const url = `${instance.url.replace(/\/$/, "")}/api/admin${endpoint}`;
        return makeApiRequest(url, {
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
    /**
     * Get all configured Unleash instances.
     */
    getAllInstances() {
        return this.config.instances;
    }
}
//# sourceMappingURL=client.js.map