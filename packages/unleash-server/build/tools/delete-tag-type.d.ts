import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    confirmed: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    instance?: unknown;
    name?: unknown;
    confirmed?: unknown;
}, {
    [x: string]: any;
    instance?: unknown;
    name?: unknown;
    confirmed?: unknown;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteTagTypeTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        confirmed: any;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        instance?: unknown;
        name?: unknown;
        confirmed?: unknown;
    }, {
        [x: string]: any;
        instance?: unknown;
        name?: unknown;
        confirmed?: unknown;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag-type.d.ts.map