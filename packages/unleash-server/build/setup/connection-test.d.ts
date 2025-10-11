import type { UnleashInstance } from "../config/types.js";
export type ConnectionTestResult = {
    success: boolean;
    error?: string;
    projects?: string[];
    environments?: string[];
    tokenExpiry?: string;
};
/**
 * Tests connection to an Unleash server during interactive setup.
 *
 * Validates that:
 * - The server URL is reachable
 * - The API token is valid and authenticated
 * - The specified project exists and is accessible
 * - Available environments can be discovered
 *
 * Used by the setup wizard to provide immediate feedback before saving configuration.
 */
export declare function testConnection(instance: Pick<UnleashInstance, "url" | "token"> & {
    project?: string;
}): Promise<ConnectionTestResult>;
//# sourceMappingURL=connection-test.d.ts.map