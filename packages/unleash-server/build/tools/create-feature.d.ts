import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["release", "experiment", "operational", "kill-switch", "permission"]>>;
    project: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    name: string;
    type: "release" | "experiment" | "operational" | "kill-switch" | "permission";
    project?: string | undefined;
    description?: string | undefined;
}, {
    instance: string;
    name: string;
    type?: "release" | "experiment" | "operational" | "kill-switch" | "permission" | undefined;
    project?: string | undefined;
    description?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const createFeatureTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["release", "experiment", "operational", "kill-switch", "permission"]>>;
        project: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        name: string;
        type: "release" | "experiment" | "operational" | "kill-switch" | "permission";
        project?: string | undefined;
        description?: string | undefined;
    }, {
        instance: string;
        name: string;
        type?: "release" | "experiment" | "operational" | "kill-switch" | "permission" | undefined;
        project?: string | undefined;
        description?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=create-feature.d.ts.map