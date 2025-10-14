import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
    confirmed: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    instance?: unknown;
    type?: unknown;
    value?: unknown;
    confirmed?: unknown;
}, {
    [x: string]: any;
    instance?: unknown;
    type?: unknown;
    value?: unknown;
    confirmed?: unknown;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteTagTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
        confirmed: any;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        instance?: unknown;
        type?: unknown;
        value?: unknown;
        confirmed?: unknown;
    }, {
        [x: string]: any;
        instance?: unknown;
        type?: unknown;
        value?: unknown;
        confirmed?: unknown;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag.d.ts.map