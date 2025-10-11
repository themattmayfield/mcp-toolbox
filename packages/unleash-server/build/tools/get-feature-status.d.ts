import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    name: string;
    environment?: string | undefined;
    project?: string | undefined;
}, {
    instance: string;
    name: string;
    environment?: string | undefined;
    project?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const getFeatureStatusTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
        environment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        name: string;
        environment?: string | undefined;
        project?: string | undefined;
    }, {
        instance: string;
        name: string;
        environment?: string | undefined;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=get-feature-status.d.ts.map