#!/usr/bin/env node

import { createMcpServer } from "@mcp-toolbox/shared";
import { SpotifyClient } from "./client.js";
import { loadTokenProviderFromConfig } from "./config/loader.js";
import { getCurrentPlaybackTool } from "./tools/get-current-playback.js";
import { getDevicesTool } from "./tools/get-devices.js";
import { getRecentlyPlayedTool } from "./tools/get-recently-played.js";
import { getTopArtistsTool } from "./tools/get-top-artists.js";
import { getTopTracksTool } from "./tools/get-top-tracks.js";
import { pausePlaybackTool } from "./tools/pause-playback.js";
import { playTrackTool } from "./tools/play-track.js";
import { resumePlaybackTool } from "./tools/resume-playback.js";
import { skipToNextTool } from "./tools/skip-to-next.js";
import { skipToPreviousTool } from "./tools/skip-to-previous.js";

let client: SpotifyClient;

try {
	const tokenProvider = await loadTokenProviderFromConfig();
	client = new SpotifyClient(tokenProvider);
} catch (error) {
	console.error(
		"❌ Configuration Error:",
		error instanceof Error ? error.message : error,
	);
	console.log("\n💡 To set up Spotify authentication, run:");
	console.log("   bun run setup");
	console.log("\nOr set environment variable:");
	console.log("   export SPOTIFY_ACCESS_TOKEN=your_token_here");
	process.exit(1);
}

async function main() {
	const { server, start } = createMcpServer({
		name: "spotify-server",
		version: "0.1.0",
		description:
			"MCP server for Spotify API integration with flexible token management",
	});

	server.tool(
		getTopTracksTool.name,
		getTopTracksTool.description,
		getTopTracksTool.schema.shape,
		async (args) => getTopTracksTool.handler(client, args),
	);

	server.tool(
		getTopArtistsTool.name,
		getTopArtistsTool.description,
		getTopArtistsTool.schema.shape,
		async (args) => getTopArtistsTool.handler(client, args),
	);

	server.tool(
		getRecentlyPlayedTool.name,
		getRecentlyPlayedTool.description,
		getRecentlyPlayedTool.schema.shape,
		async (args) => getRecentlyPlayedTool.handler(client, args),
	);

	server.tool(
		playTrackTool.name,
		playTrackTool.description,
		playTrackTool.schema.shape,
		async (args) => playTrackTool.handler(client, args),
	);

	server.tool(
		pausePlaybackTool.name,
		pausePlaybackTool.description,
		pausePlaybackTool.schema.shape,
		async (args) => pausePlaybackTool.handler(client, args),
	);

	server.tool(
		resumePlaybackTool.name,
		resumePlaybackTool.description,
		resumePlaybackTool.schema.shape,
		async (args) => resumePlaybackTool.handler(client, args),
	);

	server.tool(
		skipToNextTool.name,
		skipToNextTool.description,
		skipToNextTool.schema.shape,
		async (args) => skipToNextTool.handler(client, args),
	);

	server.tool(
		skipToPreviousTool.name,
		skipToPreviousTool.description,
		skipToPreviousTool.schema.shape,
		async (args) => skipToPreviousTool.handler(client, args),
	);

	server.tool(
		getCurrentPlaybackTool.name,
		getCurrentPlaybackTool.description,
		getCurrentPlaybackTool.schema.shape,
		async (args) => getCurrentPlaybackTool.handler(client, args),
	);

	server.tool(
		getDevicesTool.name,
		getDevicesTool.description,
		getDevicesTool.schema.shape,
		async (args) => getDevicesTool.handler(client, args),
	);

	await start();
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
