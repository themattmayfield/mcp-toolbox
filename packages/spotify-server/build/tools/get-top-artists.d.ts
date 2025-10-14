import { z } from "zod";
import type { SpotifyClient } from "../client.js";
declare const schema: z.ZodObject<{
    timeRange: z.ZodDefault<z.ZodEnum<["short_term", "medium_term", "long_term"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    timeRange: "short_term" | "medium_term" | "long_term";
}, {
    limit?: number | undefined;
    timeRange?: "short_term" | "medium_term" | "long_term" | undefined;
}>;
declare function handler(client: SpotifyClient, args: z.infer<typeof schema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const getTopArtistsTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        timeRange: z.ZodDefault<z.ZodEnum<["short_term", "medium_term", "long_term"]>>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        timeRange: "short_term" | "medium_term" | "long_term";
    }, {
        limit?: number | undefined;
        timeRange?: "short_term" | "medium_term" | "long_term" | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=get-top-artists.d.ts.map