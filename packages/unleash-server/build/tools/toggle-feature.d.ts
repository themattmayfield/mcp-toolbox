import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    environment: z.ZodString;
    enabled: z.ZodBoolean;
    project: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    instance: string;
    environment: string;
    enabled: boolean;
    project?: string | undefined;
}, {
    name: string;
    instance: string;
    environment: string;
    enabled: boolean;
    project?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const toggleFeatureTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        environment: z.ZodString;
        enabled: z.ZodBoolean;
        project: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        instance: string;
        environment: string;
        enabled: boolean;
        project?: string | undefined;
    }, {
        name: string;
        instance: string;
        environment: string;
        enabled: boolean;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=toggle-feature.d.ts.map