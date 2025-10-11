import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    type: string;
    instance: string;
}, {
    value: string;
    type: string;
    instance: string;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<any>;
export declare const deleteTagTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        type: string;
        instance: string;
    }, {
        value: string;
        type: string;
        instance: string;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag.d.ts.map