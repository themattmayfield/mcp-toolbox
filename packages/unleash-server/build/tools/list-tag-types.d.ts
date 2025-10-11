import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
}, "strip", z.ZodTypeAny, {
    instance: string;
}, {
    instance: string;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const listTagTypesTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        instance: string;
    }, {
        instance: string;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=list-tag-types.d.ts.map