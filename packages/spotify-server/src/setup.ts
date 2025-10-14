#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "node:fs";
import { getUserConfigPath, loadConfigFromFile } from "./config/loader.js";
import { saveConfigToFile } from "./config/saver.js";
import type { SpotifyConfig } from "./config/types.js";
import { SpotifyClient } from "./client.js";
import { createEnvTokenProvider } from "./token-provider.js";

class InteractiveSetup {
	async run(): Promise<void> {
		console.log("🎵 Spotify MCP Server Setup\n");

		const existingConfig = loadConfigFromFile();
		if (existingConfig) {
			const { action } = await inquirer.prompt([
				{
					type: "list",
					name: "action",
					message: "Found existing configuration. What would you like to do?",
					choices: [
						{ name: "Reconfigure", value: "reconfigure" },
						{ name: "Test current setup", value: "test" },
						{ name: "Show config", value: "show" },
						{ name: "Exit", value: "exit" },
					],
				},
			]);

			if (action === "exit") return;
			if (action === "test") {
				await this.testConfiguration(existingConfig);
				return;
			}
			if (action === "show") {
				this.showConfig(existingConfig);
				return;
			}
		}

		console.log("Let's set up your Spotify authentication!\n");

		const { authMethod } = await inquirer.prompt([
			{
				type: "list",
				name: "authMethod",
				message: "How would you like to authenticate with Spotify?",
				choices: [
					{
						name: "OAuth with auto-refresh (recommended - never expires)",
						value: "oauth",
					},
					{
						name: "Environment variable (expires in 1 hour)",
						value: "env",
					},
					{
						name: "Custom token provider (advanced)",
						value: "custom",
					},
				],
			},
		]);

		let config: SpotifyConfig;

		if (authMethod === "oauth") {
			config = await this.setupOAuthMethod();
		} else if (authMethod === "env") {
			config = await this.setupEnvMethod();
		} else {
			config = await this.setupCustomProvider();
		}

		await this.saveConfiguration(config);
		await this.showNextSteps();
	}

	private async setupEnvMethod(): Promise<SpotifyConfig> {
		console.log("\n📝 Environment Variable Setup\n");
		console.log("You'll need to set SPOTIFY_ACCESS_TOKEN in your environment.");
		console.log(
			"You can get a token from: https://developer.spotify.com/console/get-current-user/\n",
		);

		const { hasToken } = await inquirer.prompt([
			{
				type: "confirm",
				name: "hasToken",
				message:
					"Do you have an access token you'd like to test now? (You can set it later)",
				default: false,
			},
		]);

		if (hasToken) {
			const { token } = await inquirer.prompt([
				{
					type: "password",
					name: "token",
					message: "Enter your Spotify access token:",
					mask: "•",
				},
			]);

			process.env.SPOTIFY_ACCESS_TOKEN = token;

			console.log("\n🔍 Testing token...");
			const client = new SpotifyClient(createEnvTokenProvider());
			const isValid = await client.testConnection();

			if (isValid) {
				console.log("✅ Token is valid!");
				const user = await client.getCurrentUser();
				console.log(`👤 Logged in as: ${user.display_name} (${user.email})`);
			} else {
				console.log("❌ Token validation failed. Please check your token.");
			}
		}

		return { useEnvToken: true };
	}

	private async setupOAuthMethod(): Promise<SpotifyConfig> {
		console.log("\n🔐 OAuth Setup with Auto-Refresh\n");
		console.log("This method uses OAuth with a refresh token.");
		console.log("Benefits:");
		console.log("  ✅ Tokens auto-refresh - never expires");
		console.log("  ✅ No manual token updates needed");
		console.log("  ✅ Set it once, forget it\n");

		console.log("📋 You'll need:");
		console.log("  1. Client ID");
		console.log("  2. Client Secret");
		console.log("  3. Refresh Token\n");

		console.log("🔗 Get these by:");
		console.log("  1. Go to: https://developer.spotify.com/dashboard");
		console.log("  2. Create an app (or use existing)");
		console.log("  3. Note your Client ID and Client Secret");
		console.log(
			"  4. Get refresh token (see README for authorization code flow)\n",
		);

		const answers = await inquirer.prompt([
			{
				type: "input",
				name: "clientId",
				message: "Client ID:",
				validate: (input: string) => {
					if (!input.trim()) return "Client ID is required";
					return true;
				},
			},
			{
				type: "password",
				name: "clientSecret",
				message: "Client Secret:",
				mask: "•",
				validate: (input: string) => {
					if (!input.trim()) return "Client Secret is required";
					return true;
				},
			},
			{
				type: "password",
				name: "refreshToken",
				message: "Refresh Token:",
				mask: "•",
				validate: (input: string) => {
					if (!input.trim()) return "Refresh Token is required";
					return true;
				},
			},
		]);

		console.log("\n🔍 Testing OAuth configuration...");

		try {
			const { createOAuthTokenProvider } = await import(
				"./token-provider-oauth.js"
			);
			const provider = createOAuthTokenProvider({
				clientId: answers.clientId,
				clientSecret: answers.clientSecret,
				refreshToken: answers.refreshToken,
			});

			const client = new SpotifyClient(provider);
			const isValid = await client.testConnection();

			if (isValid) {
				console.log("✅ OAuth configuration is valid!");
				const user = await client.getCurrentUser();
				console.log(`👤 Logged in as: ${user.display_name} (${user.email})`);
				console.log("🎉 Tokens will auto-refresh - no more expiration issues!");
			} else {
				console.log(
					"❌ OAuth validation failed. Please check your credentials.",
				);
			}
		} catch (error) {
			console.log(
				"❌ OAuth test failed:",
				error instanceof Error ? error.message : error,
			);
		}

		return {
			useEnvToken: false,
			oauth: {
				clientId: answers.clientId,
				clientSecret: answers.clientSecret,
				refreshToken: answers.refreshToken,
			},
		};
	}

	private async setupCustomProvider(): Promise<SpotifyConfig> {
		console.log("\n🔧 Custom Token Provider Setup\n");
		console.log(
			"A token provider is a JavaScript/TypeScript file that exports:",
		);
		console.log("  export default {");
		console.log("    getAccessToken: async () => { return 'your_token'; }");
		console.log("  }\n");

		const { providerPath } = await inquirer.prompt([
			{
				type: "input",
				name: "providerPath",
				message: "Path to your token provider file:",
				validate: (input: string) => {
					if (!input.trim()) return "Path is required";
					if (!fs.existsSync(input)) {
						return `File not found: ${input}`;
					}
					return true;
				},
			},
		]);

		return { tokenProviderPath: providerPath, useEnvToken: false };
	}

	private async testConfiguration(config: SpotifyConfig): Promise<void> {
		console.log("\n🔍 Testing configuration...\n");

		try {
			let client: SpotifyClient;

			if (config.useEnvToken) {
				if (!process.env.SPOTIFY_ACCESS_TOKEN) {
					console.log(
						"❌ SPOTIFY_ACCESS_TOKEN environment variable is not set",
					);
					return;
				}
				client = new SpotifyClient(createEnvTokenProvider());
			} else if (config.tokenProviderPath) {
				const { loadTokenProvider } = await import("./token-provider.js");
				const provider = await loadTokenProvider(config.tokenProviderPath);
				client = new SpotifyClient(provider);
			} else {
				console.log("❌ No token provider configured");
				return;
			}

			const isValid = await client.testConnection();

			if (isValid) {
				console.log("✅ Connection successful!");
				const user = await client.getCurrentUser();
				console.log(`👤 Logged in as: ${user.display_name} (${user.email})`);
				console.log(`🌍 Country: ${user.country}\n`);
			} else {
				console.log("❌ Connection failed. Please check your configuration.\n");
			}
		} catch (error) {
			console.error(
				"❌ Error:",
				error instanceof Error ? error.message : error,
			);
		}
	}

	private showConfig(config: SpotifyConfig): void {
		console.log("\n📋 Current Configuration:\n");
		console.log(JSON.stringify(config, null, 2));
		console.log("");
	}

	private async saveConfiguration(config: SpotifyConfig): Promise<void> {
		const { confirm } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirm",
				message: "Save this configuration?",
				default: true,
			},
		]);

		if (!confirm) {
			console.log("❌ Setup cancelled.");
			process.exit(0);
		}

		saveConfigToFile(config);
		console.log(`\n✅ Configuration saved to ${getUserConfigPath()}`);
	}

	private async showNextSteps(): Promise<void> {
		console.log("\n🎉 Setup complete!\n");
		console.log("📋 Next steps:");
		console.log("1. Add to your Claude Desktop config:");
		console.log("   {");
		console.log('     "mcpServers": {');
		console.log('       "spotify": {');
		console.log('         "command": "npx",');
		console.log('         "args": ["-y", "@mcp-toolbox/spotify-server"],');
		console.log('         "env": {');
		console.log(
			'           "SPOTIFY_ACCESS_TOKEN": "your_token_here"  // If using env method',
		);
		console.log("         }");
		console.log("       }");
		console.log("     }");
		console.log("   }");
		console.log("");
		console.log("   Or for opencode users, add to opencode.json:");
		console.log("   {");
		console.log('     "spotify": {');
		console.log('       "type": "local",');
		console.log(
			'       "command": ["npx", "-y", "@mcp-toolbox/spotify-server@latest"],',
		);
		console.log('       "env": {');
		console.log('         "SPOTIFY_ACCESS_TOKEN": "your_token_here"');
		console.log("       },");
		console.log('       "enabled": true');
		console.log("     }");
		console.log("   }");
		console.log("");
		console.log("2. Get a Spotify access token:");
		console.log(
			"   Visit: https://developer.spotify.com/console/get-current-user/",
		);
		console.log("   Required scopes: user-read-recently-played, user-top-read");
		console.log("");
		console.log("🎵 You're all set! Restart Claude Desktop and enjoy!");
	}
}

async function main() {
	try {
		const setup = new InteractiveSetup();
		await setup.run();
	} catch (error) {
		console.error("❌ Setup failed:", error);
		process.exit(1);
	}
}

main();

export { InteractiveSetup };
