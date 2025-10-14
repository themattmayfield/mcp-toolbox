import { z } from "zod";
import type { SpotifyClient } from "../client.js";

const schema = z.object({
	deviceId: z
		.string()
		.optional()
		.describe("Spotify device ID to pause (optional)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	try {
		await client.pausePlayback(args.deviceId);

		return {
			content: [
				{
					type: "text" as const,
					text: "⏸️ Playback paused",
				},
			],
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("NO_ACTIVE_DEVICE")) {
				return {
					content: [
						{
							type: "text" as const,
							text: "❌ No active Spotify device found.",
						},
					],
				};
			}
			return {
				content: [
					{
						type: "text" as const,
						text: `❌ Error: ${error.message}`,
					},
				],
			};
		}
		throw error;
	}
}

export const pausePlaybackTool = {
	name: "spotify_pause",
	description:
		"Pause the currently playing track on Spotify. Requires an active Spotify device and Premium.",
	schema,
	handler,
};
