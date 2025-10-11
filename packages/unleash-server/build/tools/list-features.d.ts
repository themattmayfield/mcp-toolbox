import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    environment?: string | undefined;
    project?: string | undefined;
}, {
    instance: string;
    environment?: string | undefined;
    project?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const listFeaturesTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
        environment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        environment?: string | undefined;
        project?: string | undefined;
    }, {
        instance: string;
        environment?: string | undefined;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=list-features.d.ts.map