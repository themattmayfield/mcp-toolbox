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

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getUserConfigPath } from "./loader.js";
import type { UnleashConfig } from "./types.js";

export function saveConfigToFile(
	config: UnleashConfig,
	configPath?: string,
): void {
	const targetPath = configPath || getUserConfigPath();

	const dir = join(targetPath, "..");
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	writeFileSync(targetPath, JSON.stringify(config, null, 2), "utf8");
}

export function generateEnvVariables(config: UnleashConfig): string {
	if (config.instances.length === 1) {
		const instance = config.instances[0];
		return [
			`export UNLEASH_NAME="${instance.name}"`,
			`export UNLEASH_URL="${instance.url}"`,
			`export UNLEASH_TOKEN="${instance.token}"`,
			`export UNLEASH_PROJECT="${instance.project}"`,
		].join("\n");
	} else {
		return `export UNLEASH_INSTANCES='${JSON.stringify(config.instances, null, 2)}'`;
	}
}

export function generateClaudeDesktopConfig(config: UnleashConfig): string {
	if (config.instances.length === 1) {
		const instance = config.instances[0];
		return JSON.stringify(
			{
				mcpServers: {
					unleash: {
						command: "npx",
						args: ["@mcp-toolbox/unleash-server"],
						env: {
							UNLEASH_NAME: instance.name,
							UNLEASH_URL: instance.url,
							UNLEASH_TOKEN: instance.token,
							UNLEASH_PROJECT: instance.project,
						},
					},
				},
			},
			null,
			2,
		);
	} else {
		return JSON.stringify(
			{
				mcpServers: {
					unleash: {
						command: "npx",
						args: ["@mcp-toolbox/unleash-server"],
						env: {
							UNLEASH_INSTANCES: JSON.stringify(config.instances),
						},
					},
				},
			},
			null,
			2,
		);
	}
}
