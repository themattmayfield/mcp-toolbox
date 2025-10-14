import type { SpotifyTokenProvider } from "../token-provider.js";

export default {
	getAccessToken: async () => {
		throw new Error(
			"Cookie token provider template - implement your own cookie reading logic here. " +
				"This depends on your app's cookie storage mechanism (e.g., browser cookies, Next.js cookies, Express session, etc.)",
		);
	},
} satisfies SpotifyTokenProvider;
