#!/usr/bin/env node

import { createMcpServer } from "@mcp-toolbox/shared";
import { UnleashClient } from "./client.js";
import { loadConfig } from "./config/loader.js";
import {
	listAllFeaturesHandler,
	listEnvironmentsHandler,
} from "./handlers/environments.js";
import {
	archiveFeatureHandler,
	createFeatureHandler,
	getFeatureStatusHandler,
	listFeaturesHandler,
	toggleFeatureHandler,
} from "./handlers/features.js";
import { listInstancesHandler } from "./handlers/instances.js";
import {
	ArchiveFeatureSchema,
	CreateFeatureSchema,
	GetFeatureStatusSchema,
	ListAllFeaturesSchema,
	ListEnvironmentsSchema,
	ListFeaturesSchema,
	ListInstancesSchema,
	ToggleFeatureSchema,
} from "./schemas.js";

let client: UnleashClient;

try {
	const config = loadConfig();
	client = new UnleashClient(config);
} catch (error) {
	console.error(
		"❌ Configuration Error:",
		error instanceof Error ? error.message : error,
	);
	console.log("\n💡 To set up your Unleash instances, run:");
	console.log("   bun run setup");
	console.log("\nOr set environment variables:");
	console.log("   export UNLEASH_URL=https://your-unleash.com");
	console.log("   export UNLEASH_TOKEN=your-admin-token");
	process.exit(1);
}

async function main() {
	const { server, start } = createMcpServer({
		name: "unleash-server",
		version: "1.0.0",
		description:
			"MCP server for managing Unleash feature flags across multiple instances and environments",
	});

	server.tool(
		"list_instances",
		"Show all configured Unleash server instances (e.g., production, staging, development). Use this to see what instances are available.",
		ListInstancesSchema.shape,
		async () => listInstancesHandler(client),
	);

	server.tool(
		"create_feature",
		"Create a new feature flag and explicitly disable it in all configured environments for the instance. Ensures consistent environment-specific state from creation.",
		CreateFeatureSchema.shape,
		async (args) => createFeatureHandler(client, args),
	);

	server.tool(
		"archive_feature",
		"Archive (soft delete) a feature flag when it's no longer needed. Archived flags are hidden from normal views but can be restored if needed.",
		ArchiveFeatureSchema.shape,
		async (args) => archiveFeatureHandler(client, args),
	);

	server.tool(
		"list_features",
		"List feature flags in an Unleash instance. Uses the instance's default environment to show environment-specific status. This is the main tool for viewing feature flags.",
		ListFeaturesSchema.shape,
		async (args) => listFeaturesHandler(client, args),
	);

	server.tool(
		"get_feature_status",
		"Get detailed information about a specific feature flag, including its status across all environments and any configured strategies.",
		GetFeatureStatusSchema.shape,
		async (args) => getFeatureStatusHandler(client, args),
	);

	server.tool(
		"toggle_feature",
		"Enable or disable a feature flag in a specific environment (e.g., enable in staging, disable in production). This is how you control where features are active.",
		ToggleFeatureSchema.shape,
		async (args) => toggleFeatureHandler(client, args),
	);

	server.tool(
		"list_environments",
		"Show all available environments (e.g., development, staging, production) for a specific Unleash instance. Use this to see what environments you can deploy features to.",
		ListEnvironmentsSchema.shape,
		async (args) => listEnvironmentsHandler(client, args),
	);

	server.tool(
		"list_all_features",
		"List feature flags with global status across all environments. Only use this when you specifically need to see global feature flag status rather than environment-specific status.",
		ListAllFeaturesSchema.shape,
		async (args) => listAllFeaturesHandler(client, args),
	);

	await start();
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
