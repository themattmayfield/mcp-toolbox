import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import {
	createEnvTokenProvider,
	loadTokenProvider,
} from "../token-provider.js";
import type { SpotifyTokenProvider } from "../token-provider.js";
import { createOAuthTokenProvider } from "../token-provider-oauth.js";
import { SpotifyConfigSchema, type SpotifyConfig } from "./types.js";

const CONFIG_PATHS = [
	"./spotify-toolbox.json",
	join(homedir(), ".config", "mcp-toolbox", "spotify-toolbox.json"),
	"/etc/mcp-toolbox/spotify-toolbox.json",
];

export function getUserConfigPath(): string {
	return CONFIG_PATHS[1];
}

export function loadConfigFromFile(): SpotifyConfig | null {
	for (const configPath of CONFIG_PATHS) {
		if (existsSync(configPath)) {
			try {
				const configData = readFileSync(configPath, "utf8");
				const config = JSON.parse(configData);
				return SpotifyConfigSchema.parse(config);
			} catch (error) {
				console.error(`Error loading config from ${configPath}:`, error);
			}
		}
	}
	return null;
}

export async function loadTokenProviderFromConfig(): Promise<SpotifyTokenProvider> {
	const config = loadConfigFromFile();

	if (config?.oauth) {
		console.error("🔐 Using OAuth with automatic token refresh");
		return createOAuthTokenProvider(config.oauth);
	}

	if (config?.tokenProviderPath) {
		const resolvedPath = resolve(config.tokenProviderPath);
		return loadTokenProvider(resolvedPath);
	}

	if (config?.useEnvToken || process.env.SPOTIFY_ACCESS_TOKEN) {
		return createEnvTokenProvider();
	}

	throw new Error(
		"No token provider configured. Run 'spotify-setup' to configure authentication.",
	);
}
