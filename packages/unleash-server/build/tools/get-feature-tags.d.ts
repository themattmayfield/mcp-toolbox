import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    featureName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    instance: string;
    featureName: string;
}, {
    instance: string;
    featureName: string;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const getFeatureTagsTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        featureName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        featureName: string;
    }, {
        instance: string;
        featureName: string;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=get-feature-tags.d.ts.map