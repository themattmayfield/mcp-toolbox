import type { SpotifyTokenProvider } from "../token-provider.js";

export default {
	getAccessToken: async () => {
		const token = process.env.SPOTIFY_ACCESS_TOKEN;
		if (!token) {
			throw new Error("SPOTIFY_ACCESS_TOKEN environment variable is not set");
		}
		return token;
	},
} satisfies SpotifyTokenProvider;
