#!/usr/bin/env node

import { createMcpServer } from "@mcp-toolbox/shared";
import { UnleashClient } from "./client.js";
import { loadConfig } from "./config/loader.js";
import { addFeatureStrategyTool } from "./tools/add-feature-strategy.js";
import { addFeatureTagTool } from "./tools/add-feature-tag.js";
import { archiveFeatureTool } from "./tools/archive-feature.js";
import { createFeatureTool } from "./tools/create-feature.js";
import { createTagTypeTool } from "./tools/create-tag-type.js";
import { deleteFeatureStrategyTool } from "./tools/delete-feature-strategy.js";
import { deleteTagTool } from "./tools/delete-tag.js";
import { deleteTagTypeTool } from "./tools/delete-tag-type.js";
import { getFeatureStatusTool } from "./tools/get-feature-status.js";
import { getFeatureTagsTool } from "./tools/get-feature-tags.js";
import { listAllFeaturesTool } from "./tools/list-all-features.js";
import { listEnvironmentsTool } from "./tools/list-environments.js";
import { listFeaturesTool } from "./tools/list-features.js";
import { listInstancesTool } from "./tools/list-instances.js";
import { listTagTypesTool } from "./tools/list-tag-types.js";
import { toggleFeatureTool } from "./tools/toggle-feature.js";
import { updateFeatureStrategyTool } from "./tools/update-feature-strategy.js";

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
		listInstancesTool.name,
		listInstancesTool.description,
		listInstancesTool.schema.shape,
		async () => listInstancesTool.handler(client),
	);

	server.tool(
		createFeatureTool.name,
		createFeatureTool.description,
		createFeatureTool.schema.shape,
		async (args) => createFeatureTool.handler(client, args),
	);

	server.tool(
		archiveFeatureTool.name,
		archiveFeatureTool.description,
		archiveFeatureTool.schema.shape,
		async (args) => archiveFeatureTool.handler(client, args),
	);

	server.tool(
		listFeaturesTool.name,
		listFeaturesTool.description,
		listFeaturesTool.schema.shape,
		async (args) => listFeaturesTool.handler(client, args),
	);

	server.tool(
		getFeatureStatusTool.name,
		getFeatureStatusTool.description,
		getFeatureStatusTool.schema.shape,
		async (args) => getFeatureStatusTool.handler(client, args),
	);

	server.tool(
		toggleFeatureTool.name,
		toggleFeatureTool.description,
		toggleFeatureTool.schema.shape,
		async (args) => toggleFeatureTool.handler(client, args),
	);

	server.tool(
		listEnvironmentsTool.name,
		listEnvironmentsTool.description,
		listEnvironmentsTool.schema.shape,
		async (args) => listEnvironmentsTool.handler(client, args),
	);

	server.tool(
		listAllFeaturesTool.name,
		listAllFeaturesTool.description,
		listAllFeaturesTool.schema.shape,
		async (args) => listAllFeaturesTool.handler(client, args),
	);

	server.tool(
		addFeatureTagTool.name,
		addFeatureTagTool.description,
		addFeatureTagTool.schema.shape,
		async (args) => addFeatureTagTool.handler(client, args),
	);

	server.tool(
		addFeatureStrategyTool.name,
		addFeatureStrategyTool.description,
		addFeatureStrategyTool.schema.shape,
		async (args) => addFeatureStrategyTool.handler(client, args),
	);

	server.tool(
		deleteFeatureStrategyTool.name,
		deleteFeatureStrategyTool.description,
		deleteFeatureStrategyTool.schema.shape,
		async (args) => deleteFeatureStrategyTool.handler(client, args),
	);

	server.tool(
		getFeatureTagsTool.name,
		getFeatureTagsTool.description,
		getFeatureTagsTool.schema.shape,
		async (args) => getFeatureTagsTool.handler(client, args),
	);

	server.tool(
		updateFeatureStrategyTool.name,
		updateFeatureStrategyTool.description,
		updateFeatureStrategyTool.schema.shape,
		async (args) => updateFeatureStrategyTool.handler(client, args),
	);

	server.tool(
		listTagTypesTool.name,
		listTagTypesTool.description,
		listTagTypesTool.schema.shape,
		async (args) => listTagTypesTool.handler(client, args),
	);

	server.tool(
		createTagTypeTool.name,
		createTagTypeTool.description,
		createTagTypeTool.schema.shape,
		async (args) => createTagTypeTool.handler(client, args),
	);

	server.tool(
		deleteTagTypeTool.name,
		deleteTagTypeTool.description,
		deleteTagTypeTool.schema.shape,
		async (args) => deleteTagTypeTool.handler(client, args),
	);

	server.tool(
		deleteTagTool.name,
		deleteTagTool.description,
		deleteTagTool.schema.shape,
		async (args) => deleteTagTool.handler(client, args),
	);

	await start();
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
