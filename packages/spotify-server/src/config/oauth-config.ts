import { z } from "zod";

export const SpotifyOAuthConfigSchema = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	refreshToken: z.string(),
});

export type SpotifyOAuthConfig = z.infer<typeof SpotifyOAuthConfigSchema>;
