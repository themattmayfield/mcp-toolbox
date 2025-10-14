import { z } from "zod";
import type { SpotifyClient } from "../client.js";
declare const schema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
}, {
    limit?: number | undefined;
}>;
declare function handler(client: SpotifyClient, args: z.infer<typeof schema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const getRecentlyPlayedTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
    }, {
        limit?: number | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=get-recently-played.d.ts.map