import { z } from "zod";
import type { SpotifyClient } from "../client.js";
declare const schema: z.ZodObject<{
    deviceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deviceId?: string | undefined;
}, {
    deviceId?: string | undefined;
}>;
declare function handler(client: SpotifyClient, args: z.infer<typeof schema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const pausePlaybackTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        deviceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        deviceId?: string | undefined;
    }, {
        deviceId?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=pause-playback.d.ts.map