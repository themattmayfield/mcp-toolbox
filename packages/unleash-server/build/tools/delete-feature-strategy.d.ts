import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    featureName: z.ZodString;
    environment: z.ZodString;
    strategyId: z.ZodString;
    project: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    featureName: string;
    environment: string;
    strategyId: string;
    project?: string | undefined;
}, {
    instance: string;
    featureName: string;
    environment: string;
    strategyId: string;
    project?: string | undefined;
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
    }, "strip", z.ZodTypeAny, {
        instance: string;
        featureName: string;
        environment: string;
        strategyId: string;
        project?: string | undefined;
    }, {
        instance: string;
        featureName: string;
        environment: string;
        strategyId: string;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-feature-strategy.d.ts.map