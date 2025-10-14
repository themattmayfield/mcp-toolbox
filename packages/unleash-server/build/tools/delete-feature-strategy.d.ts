import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    featureName: z.ZodString;
    environment: z.ZodString;
    strategyId: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
    confirmed: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    instance?: unknown;
    featureName?: unknown;
    environment?: unknown;
    strategyId?: unknown;
    project?: unknown;
    confirmed?: unknown;
}, {
    [x: string]: any;
    instance?: unknown;
    featureName?: unknown;
    environment?: unknown;
    strategyId?: unknown;
    project?: unknown;
    confirmed?: unknown;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const deleteFeatureStrategyTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        featureName: z.ZodString;
        environment: z.ZodString;
        strategyId: z.ZodString;
        project: z.ZodOptional<z.ZodString>;
        confirmed: any;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        instance?: unknown;
        featureName?: unknown;
        environment?: unknown;
        strategyId?: unknown;
        project?: unknown;
        confirmed?: unknown;
    }, {
        [x: string]: any;
        instance?: unknown;
        featureName?: unknown;
        environment?: unknown;
        strategyId?: unknown;
        project?: unknown;
        confirmed?: unknown;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-feature-strategy.d.ts.map