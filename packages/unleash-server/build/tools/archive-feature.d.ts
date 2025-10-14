import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    name: string;
    confirmed: boolean;
    project?: string | undefined;
}, {
    instance: string;
    name: string;
    project?: string | undefined;
    confirmed?: boolean | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const archiveFeatureTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
        confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        name: string;
        confirmed: boolean;
        project?: string | undefined;
    }, {
        instance: string;
        name: string;
        project?: string | undefined;
        confirmed?: boolean | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=archive-feature.d.ts.map