import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    instance: string;
    type: string;
    value: string;
}, {
    instance: string;
    type: string;
    value: string;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteTagTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        type: string;
        value: string;
    }, {
        instance: string;
        type: string;
        value: string;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag.d.ts.map