import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    confirmed: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    instance?: unknown;
    name?: unknown;
    project?: unknown;
    confirmed?: unknown;
}, {
    [x: string]: any;
    instance?: unknown;
    name?: unknown;
    project?: unknown;
    confirmed?: unknown;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const archiveFeatureTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
        confirmed: any;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        instance?: unknown;
        name?: unknown;
        project?: unknown;
        confirmed?: unknown;
    }, {
        [x: string]: any;
        instance?: unknown;
        name?: unknown;
        project?: unknown;
        confirmed?: unknown;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=archive-feature.d.ts.map