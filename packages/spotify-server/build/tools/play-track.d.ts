import { z } from "zod";
import type { SpotifyClient } from "../client.js";
declare const schema: z.ZodObject<{
    query: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    deviceId?: string | undefined;
}, {
    query: string;
    deviceId?: string | undefined;
}>;
declare function handler(client: SpotifyClient, args: z.infer<typeof schema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const playTrackTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        query: z.ZodString;
        deviceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        query: string;
        deviceId?: string | undefined;
    }, {
        query: string;
        deviceId?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=play-track.d.ts.map