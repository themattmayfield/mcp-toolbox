import { z } from "zod";
export declare const SpotifyConfigSchema: z.ZodObject<{
    tokenProviderPath: z.ZodOptional<z.ZodString>;
    useEnvToken: z.ZodDefault<z.ZodBoolean>;
    oauth: z.ZodOptional<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    useEnvToken: boolean;
    tokenProviderPath?: string | undefined;
    oauth?: {
        clientId: string;
        clientSecret: string;
        refreshToken: string;
    } | undefined;
}, {
    tokenProviderPath?: string | undefined;
    useEnvToken?: boolean | undefined;
    oauth?: {
        clientId: string;
        clientSecret: string;
        refreshToken: string;
    } | undefined;
}>;
export type SpotifyConfig = z.infer<typeof SpotifyConfigSchema>;
//# sourceMappingURL=types.d.ts.map