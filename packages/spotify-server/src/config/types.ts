import { z } from "zod";

export const SpotifyConfigSchema = z.object({
	tokenProviderPath: z.string().optional(),
	useEnvToken: z.boolean().default(false),
	oauth: z
		.object({
			clientId: z.string(),
			clientSecret: z.string(),
			refreshToken: z.string(),
		})
		.optional(),
});

export type SpotifyConfig = z.infer<typeof SpotifyConfigSchema>;
