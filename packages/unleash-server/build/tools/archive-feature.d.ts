import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    instance: string;
    project?: string | undefined;
}, {
    name: string;
    instance: string;
    project?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const archiveFeatureTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        instance: string;
        project?: string | undefined;
    }, {
        name: string;
        instance: string;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=archive-feature.d.ts.map