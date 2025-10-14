import fs from "node:fs";
import path from "node:path";
import type { SpotifyConfig } from "./types.js";
import { getUserConfigPath } from "./loader.js";

export function saveConfigToFile(config: SpotifyConfig): void {
	const configPath = getUserConfigPath();
	const configDir = path.dirname(configPath);

	if (!fs.existsSync(configDir)) {
		fs.mkdirSync(configDir, { recursive: true });
	}

	fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export function generateEnvVariables(config: SpotifyConfig): string {
	const lines: string[] = [];

	if (config.useEnvToken) {
		lines.push("SPOTIFY_ACCESS_TOKEN=your_access_token_here");
	}

	if (config.tokenProviderPath) {
		lines.push(`SPOTIFY_TOKEN_PROVIDER=${config.tokenProviderPath}`);
	}

	return lines.join("\n");
}
