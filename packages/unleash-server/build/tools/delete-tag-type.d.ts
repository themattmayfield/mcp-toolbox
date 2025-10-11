import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    instance: string;
}, {
    name: string;
    instance: string;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<any>;
export declare const deleteTagTypeTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        instance: string;
    }, {
        name: string;
        instance: string;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=delete-tag-type.d.ts.map