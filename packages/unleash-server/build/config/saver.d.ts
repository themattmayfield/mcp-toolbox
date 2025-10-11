/**
 * Saves Unleash server configuration to files and generates configuration snippets.
 *
 * Provides utilities to:
 * - Save configuration to JSON files
 * - Generate environment variable snippets for shell
 * - Generate Claude Desktop configuration snippets
 *
 * Used by the interactive setup wizard to persist user configuration choices.
 */
import type { UnleashConfig } from "./types.js";
export declare function saveConfigToFile(config: UnleashConfig, configPath?: string): void;
export declare function generateEnvVariables(config: UnleashConfig): string;
export declare function generateClaudeDesktopConfig(config: UnleashConfig): string;
//# sourceMappingURL=saver.d.ts.map