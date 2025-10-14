import { z } from "zod";
import type { SpotifyClient } from "../client.js";

const schema = z.object({
	timeRange: z
		.enum(["short_term", "medium_term", "long_term"])
		.default("medium_term")
		.describe(
			"Time range: short_term (last 4 weeks), medium_term (last 6 months), long_term (all time)",
		),
	limit: z
		.number()
		.min(1)
		.max(50)
		.default(20)
		.describe("Number of tracks to return (1-50)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	const result = await client.getTopTracks(args.timeRange, args.limit);

	const tracks = result.items.map((track) => ({
		name: track.name,
		artists: track.artists.map((a) => a.name).join(", "),
		album: track.album.name,
		popularity: track.popularity,
		duration_ms: track.duration_ms,
		spotify_url: track.external_urls.spotify,
		preview_url: track.preview_url,
	}));

	return {
		content: [
			{
				type: "text" as const,
				text: JSON.stringify(
					{
						time_range: args.timeRange,
						total: result.total,
						tracks,
					},
					null,
					2,
				),
			},
		],
	};
}

export const getTopTracksTool = {
	name: "spotify_get_top_tracks",
	description:
		"Get the user's top tracks based on listening history. Returns detailed information including track name, artists, album, and popularity. Use short_term for recent favorites (last 4 weeks), medium_term for the last 6 months, or long_term for all-time favorites.",
	schema,
	handler,
};
