import { z } from "zod";
import type { SpotifyClient } from "../client.js";

const schema = z.object({
	deviceId: z
		.string()
		.optional()
		.describe("Spotify device ID to resume on (optional)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	try {
		await client.startPlayback({}, args.deviceId);

		return {
			content: [
				{
					type: "text" as const,
					text: "▶️ Playback resumed",
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

export const resumePlaybackTool = {
	name: "spotify_resume",
	description:
		"Resume the currently paused track on Spotify. Requires an active Spotify device and Premium.",
	schema,
	handler,
};
