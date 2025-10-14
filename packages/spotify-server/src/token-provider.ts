export type SpotifyTokenProvider = {
	getAccessToken: () => Promise<string>;
	refreshToken?: () => Promise<string>;
};

export async function loadTokenProvider(
	path: string,
): Promise<SpotifyTokenProvider> {
	try {
		const module = await import(path);
		const provider = module.default || module;

		if (typeof provider.getAccessToken !== "function") {
			throw new Error(
				"Token provider must export a getAccessToken function that returns Promise<string>",
			);
		}

		return provider;
	} catch (error) {
		throw new Error(
			`Failed to load token provider from ${path}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export function createEnvTokenProvider(): SpotifyTokenProvider {
	return {
		getAccessToken: async () => {
			const token = process.env.SPOTIFY_ACCESS_TOKEN;
			if (!token) {
				throw new Error(
					"SPOTIFY_ACCESS_TOKEN environment variable is not set. Run 'spotify-setup' to configure.",
				);
			}
			return token;
		},
	};
}
