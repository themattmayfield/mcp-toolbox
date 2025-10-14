import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    instance: string;
    color?: string | undefined;
    description?: string | undefined;
    icon?: string | undefined;
}, {
    name: string;
    instance: string;
    color?: string | undefined;
    description?: string | undefined;
    icon?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const createTagTypeTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        instance: string;
        color?: string | undefined;
        description?: string | undefined;
        icon?: string | undefined;
    }, {
        name: string;
        instance: string;
        color?: string | undefined;
        description?: string | undefined;
        icon?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=create-tag-type.d.ts.map