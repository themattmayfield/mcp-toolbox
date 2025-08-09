import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";

// Configuration types and schemas
export const UnleashInstanceSchema = z.object({
	name: z.string().min(1, "Instance name is required"),
	url: z.string().url("Must be a valid URL"),
	token: z.string().min(1, "API token is required"),
	project: z.string().default("default"),
	timeout: z.number().default(10000),
	retries: z.number().default(3),
});

export const UnleashConfigSchema = z.object({
	instances: z
		.array(UnleashInstanceSchema)
		.min(1, "At least one instance is required"),
});

export type UnleashInstance = z.infer<typeof UnleashInstanceSchema>;
export type UnleashConfig = z.infer<typeof UnleashConfigSchema>;

// Configuration file paths (in order of precedence)
const CONFIG_PATHS = [
	"./unleash-config.json", // Current directory
	join(homedir(), ".config", "mcp-toolbox", "unleash.json"), // User config
	"/etc/mcp-toolbox/unleash.json", // System config
];

export function getConfigPaths(): string[] {
	return CONFIG_PATHS;
}

export function getUserConfigPath(): string {
	return CONFIG_PATHS[1];
}

export function loadConfigFromFile(): UnleashConfig | null {
	for (const configPath of CONFIG_PATHS) {
		if (existsSync(configPath)) {
			try {
				const configData = readFileSync(configPath, "utf8");
				const config = JSON.parse(configData);
				return UnleashConfigSchema.parse(config);
			} catch (error) {
				console.error(`Error loading config from ${configPath}:`, error);
			}
		}
	}
	return null;
}

export function loadConfigFromEnv(): UnleashConfig | null {
	// Try JSON environment variable first
	if (process.env.UNLEASH_INSTANCES) {
		try {
			const instances = JSON.parse(process.env.UNLEASH_INSTANCES);
			return UnleashConfigSchema.parse({ instances });
		} catch (error) {
			console.error("Error parsing UNLEASH_INSTANCES:", error);
		}
	}

	// Try individual environment variables
	const instances: UnleashInstance[] = [];

	// Check for simple single instance config
	if (process.env.UNLEASH_URL && process.env.UNLEASH_TOKEN) {
		instances.push({
			name: process.env.UNLEASH_NAME || "default",
			url: process.env.UNLEASH_URL,
			token: process.env.UNLEASH_TOKEN,
			project: process.env.UNLEASH_PROJECT || "default",
			timeout: process.env.UNLEASH_TIMEOUT
				? parseInt(process.env.UNLEASH_TIMEOUT)
				: 10000,
			retries: process.env.UNLEASH_RETRIES
				? parseInt(process.env.UNLEASH_RETRIES)
				: 3,
		});
	}

	// Check for numbered instances (UNLEASH_0_URL, UNLEASH_1_URL, etc.)
	let i = 0;
	while (process.env[`UNLEASH_${i}_URL`] && process.env[`UNLEASH_${i}_TOKEN`]) {
		const url = process.env[`UNLEASH_${i}_URL`];
		const token = process.env[`UNLEASH_${i}_TOKEN`];

		if (!url || !token) break;

		const timeoutStr = process.env[`UNLEASH_${i}_TIMEOUT`];
		const retriesStr = process.env[`UNLEASH_${i}_RETRIES`];

		const instance = {
			name: process.env[`UNLEASH_${i}_NAME`] || `instance-${i}`,
			url,
			token,
			project: process.env[`UNLEASH_${i}_PROJECT`] || "default",
			timeout: timeoutStr ? parseInt(timeoutStr) : 10000,
			retries: retriesStr ? parseInt(retriesStr) : 3,
		};

		try {
			instances.push(UnleashInstanceSchema.parse(instance));
		} catch (error) {
			console.error(`Error parsing instance ${i}:`, error);
		}
		i++;
	}

	if (instances.length > 0) {
		try {
			return UnleashConfigSchema.parse({ instances });
		} catch (error) {
			console.error("Error validating environment config:", error);
		}
	}

	return null;
}

export function loadConfig(): UnleashConfig {
	// Try environment variables first (for runtime flexibility)
	const envConfig = loadConfigFromEnv();
	if (envConfig) {
		return envConfig;
	}

	// Try config files
	const fileConfig = loadConfigFromFile();
	if (fileConfig) {
		return fileConfig;
	}

	// No configuration found
	throw new Error(
		"No Unleash configuration found. Please run 'bun run setup' to configure your instances, " +
			"or set environment variables (UNLEASH_URL, UNLEASH_TOKEN) or create a config file.",
	);
}

export function saveConfigToFile(
	config: UnleashConfig,
	configPath?: string,
): void {
	const targetPath = configPath || getUserConfigPath();

	// Ensure directory exists
	const dir = join(targetPath, "..");
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	// Write config file
	writeFileSync(targetPath, JSON.stringify(config, null, 2), "utf8");
}

export function generateEnvVariables(config: UnleashConfig): string {
	if (config.instances.length === 1) {
		// Simple single instance format
		const instance = config.instances[0];
		return [
			`export UNLEASH_NAME="${instance.name}"`,
			`export UNLEASH_URL="${instance.url}"`,
			`export UNLEASH_TOKEN="${instance.token}"`,
			`export UNLEASH_PROJECT="${instance.project}"`,
		].join("\n");
	} else {
		// JSON format for multiple instances
		return `export UNLEASH_INSTANCES='${JSON.stringify(config.instances, null, 2)}'`;
	}
}

export function generateClaudeDesktopConfig(config: UnleashConfig): string {
	if (config.instances.length === 1) {
		// Simple single instance format
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
		// JSON format for multiple instances
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
