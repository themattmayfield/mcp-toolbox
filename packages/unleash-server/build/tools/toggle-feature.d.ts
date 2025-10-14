import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    environment: z.ZodString;
    enabled: z.ZodBoolean;
    project: z.ZodOptional<z.ZodString>;
    confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    name: string;
    confirmed: boolean;
    environment: string;
    enabled: boolean;
    project?: string | undefined;
}, {
    instance: string;
    name: string;
    environment: string;
    enabled: boolean;
    project?: string | undefined;
    confirmed?: boolean | undefined;
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
        confirmed: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        name: string;
        confirmed: boolean;
        environment: string;
        enabled: boolean;
        project?: string | undefined;
    }, {
        instance: string;
        name: string;
        environment: string;
        enabled: boolean;
        project?: string | undefined;
        confirmed?: boolean | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=toggle-feature.d.ts.map