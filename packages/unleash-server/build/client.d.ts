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
import type { UnleashConfig, UnleashInstance } from "./config/types.js";
export declare class UnleashClient {
    private config;
    constructor(config: UnleashConfig);
    /**
     * Get an Unleash instance by name.
     * @throws Error if instance name is not found
     */
    getInstance(instanceName: string): UnleashInstance;
    /**
     * Resolve project name, using instance default or "default" as fallback.
     */
    getProjectName(instance: UnleashInstance, project?: string): string;
    /**
     * Resolve environment name, using instance default if not specified.
     * @throws Error if environment is specified but not configured for the instance
     */
    getEnvironmentName(instance: UnleashInstance, environment?: string): string | undefined;
    /**
     * Make an authenticated API request to an Unleash instance.
     * @returns Response data or null if request fails
     */
    makeRequest<T>(instance: UnleashInstance, endpoint: string, options?: {
        method?: string;
        body?: unknown;
    }): Promise<T | null>;
    /**
     * Get all configured Unleash instances.
     */
    getAllInstances(): {
        name: string;
        project: string;
        url: string;
        token: string;
        timeout: number;
        retries: number;
        environments?: string[] | undefined;
        defaultEnvironment?: string | undefined;
    }[];
}
//# sourceMappingURL=client.d.ts.map