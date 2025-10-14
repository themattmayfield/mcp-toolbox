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
		.describe("Number of artists to return (1-50)"),
});

async function handler(client: SpotifyClient, args: z.infer<typeof schema>) {
	const result = await client.getTopArtists(args.timeRange, args.limit);

	const artists = result.items.map((artist) => ({
		name: artist.name,
		genres: artist.genres || [],
		spotify_url: artist.external_urls.spotify,
		images: artist.images?.map((img) => img.url) || [],
	}));

	return {
		content: [
			{
				type: "text" as const,
				text: JSON.stringify(
					{
						time_range: args.timeRange,
						total: result.total,
						artists,
					},
					null,
					2,
				),
			},
		],
	};
}

export const getTopArtistsTool = {
	name: "spotify_get_top_artists",
	description:
		"Get the user's top artists based on listening history. Returns detailed information including artist name, genres, and popularity. Use short_term for recent favorites (last 4 weeks), medium_term for the last 6 months, or long_term for all-time favorites.",
	schema,
	handler,
};
