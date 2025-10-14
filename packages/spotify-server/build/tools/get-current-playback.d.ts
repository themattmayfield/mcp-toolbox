import { z } from "zod";
import type { SpotifyClient } from "../client.js";
declare const schema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
declare function handler(client: SpotifyClient, _args: z.infer<typeof schema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const getCurrentPlaybackTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=get-current-playback.d.ts.map