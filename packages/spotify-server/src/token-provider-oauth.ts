import type { SpotifyOAuthConfig } from "./config/oauth-config.js";
import type { SpotifyTokenProvider } from "./token-provider.js";

type TokenCache = {
	accessToken: string;
	expiresAt: number;
};

export function createOAuthTokenProvider(
	config: SpotifyOAuthConfig,
): SpotifyTokenProvider {
	let tokenCache: TokenCache | null = null;

	const refreshAccessToken = async (): Promise<string> => {
		const basicAuth = Buffer.from(
			`${config.clientId}:${config.clientSecret}`,
		).toString("base64");

		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${basicAuth}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: config.refreshToken,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Failed to refresh token: ${error.error_description || error.error}`,
			);
		}

		const data = await response.json();

		tokenCache = {
			accessToken: data.access_token,
			expiresAt: Date.now() + data.expires_in * 1000 - 60000,
		};

		return data.access_token;
	};

	return {
		getAccessToken: async () => {
			if (!tokenCache || Date.now() >= tokenCache.expiresAt) {
				console.error("🔄 Refreshing Spotify access token...");
				await refreshAccessToken();
			}

			if (!tokenCache) {
				throw new Error("Failed to get access token");
			}

			return tokenCache.accessToken;
		},
		refreshToken: refreshAccessToken,
	};
}
