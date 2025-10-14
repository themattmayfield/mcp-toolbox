import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
    confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    confirmed: boolean;
    value: string;
    type: string;
}, {
    instance: string;
    value: string;
    type: string;
    confirmed?: boolean | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteTagTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
        confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        confirmed: boolean;
        value: string;
        type: string;
    }, {
        instance: string;
        value: string;
        type: string;
        confirmed?: boolean | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag.d.ts.map