import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare function handler(client: UnleashClient): Promise<any>;
export declare const listInstancesTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=list-instances.d.ts.map