import { z } from "zod";
export declare const SpotifyOAuthConfigSchema: z.ZodObject<{
    clientId: z.ZodString;
    clientSecret: z.ZodString;
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}, {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}>;
export type SpotifyOAuthConfig = z.infer<typeof SpotifyOAuthConfigSchema>;
//# sourceMappingURL=oauth-config.d.ts.map