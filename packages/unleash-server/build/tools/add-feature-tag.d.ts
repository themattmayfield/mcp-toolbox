import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    featureName: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    featureName: string;
    value: string;
    type: string;
    color?: string | undefined;
}, {
    instance: string;
    featureName: string;
    value: string;
    type: string;
    color?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const addFeatureTagTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        featureName: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        featureName: string;
        value: string;
        type: string;
        color?: string | undefined;
    }, {
        instance: string;
        featureName: string;
        value: string;
        type: string;
        color?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=add-feature-tag.d.ts.map