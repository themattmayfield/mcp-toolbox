import { z } from "zod";
export const SpotifyOAuthConfigSchema = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    refreshToken: z.string(),
});
//# sourceMappingURL=oauth-config.js.map