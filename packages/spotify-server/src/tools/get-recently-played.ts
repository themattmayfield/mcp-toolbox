import { z } from "zod";
import type { SpotifyClient } from "../client.js";

const schema = z.object({
	limit: z
		.number()
		.min(1)
		.max(50)
		.default(20)
		.describe("Number of recently played tracks to return (1-50)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	const result = await client.getRecentlyPlayed(args.limit);

	const plays = result.items.map((play) => ({
		track_name: play.track.name,
		artists: play.track.artists.map((a) => a.name).join(", "),
		album: play.track.album.name,
		played_at: play.played_at,
		spotify_url: play.track.external_urls.spotify,
	}));

	return {
		content: [
			{
				type: "text" as const,
				text: JSON.stringify(
					{
						total_returned: plays.length,
						plays,
					},
					null,
					2,
				),
			},
		],
	};
}

export const getRecentlyPlayedTool = {
	name: "spotify_get_recently_played",
	description:
		"Get the user's recently played tracks with timestamps. Shows the last tracks played including when they were played. Useful for understanding recent listening patterns.",
	schema,
	handler,
};
