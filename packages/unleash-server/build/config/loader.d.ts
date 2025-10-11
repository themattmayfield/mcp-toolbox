/**
 * Loads Unleash server configuration from environment variables or config files.
 *
 * Configuration is loaded in this order of precedence:
 * 1. Environment variables (UNLEASH_URL, UNLEASH_TOKEN, or UNLEASH_INSTANCES JSON)
 * 2. Local config file (./unleash-config.json)
 * 3. User config file (~/.config/mcp-toolbox/unleash.json)
 * 4. System config file (/etc/mcp-toolbox/unleash.json)
 *
 * Supports both single instance and multi-instance configurations.
 */
import type { UnleashConfig } from "./types.js";
export declare function getConfigPaths(): string[];
export declare function getUserConfigPath(): string;
export declare function loadConfigFromFile(): UnleashConfig | null;
export declare function loadConfigFromEnv(): UnleashConfig | null;
export declare function loadConfig(): UnleashConfig;
//# sourceMappingURL=loader.d.ts.map