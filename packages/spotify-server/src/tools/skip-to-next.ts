import { z } from "zod";
import type { SpotifyClient } from "../client.js";

const schema = z.object({
	deviceId: z
		.string()
		.optional()
		.describe("Spotify device ID to skip on (optional)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	try {
		await client.skipToNext(args.deviceId);

		return {
			content: [
				{
					type: "text" as const,
					text: "⏭️ Skipped to next track",
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

export const skipToNextTool = {
	name: "spotify_next",
	description:
		"Skip to the next track in the queue on Spotify. Requires an active Spotify device and Premium.",
	schema,
	handler,
};
