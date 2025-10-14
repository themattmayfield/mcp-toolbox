import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    name: string;
    confirmed: boolean;
}, {
    instance: string;
    name: string;
    confirmed?: boolean | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteTagTypeTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        name: string;
        confirmed: boolean;
    }, {
        instance: string;
        name: string;
        confirmed?: boolean | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag-type.d.ts.map