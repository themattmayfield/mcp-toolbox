import { z } from "zod";
export interface McpToolResponse {
    [x: string]: unknown;
    content: Array<{
        type: "text";
        text: string;
    }>;
}
export interface McpServerConfig {
    name: string;
    version: string;
    description?: string;
}
export interface ApiRequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    method?: string;
    body?: string;
}
export declare const CoordinatesSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    latitude: number;
    longitude: number;
}, {
    latitude: number;
    longitude: number;
}>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export declare const StateCodeSchema: z.ZodString;
export type StateCode = z.infer<typeof StateCodeSchema>;
//# sourceMappingURL=types.d.ts.map