import { z } from "zod";
import type { UnleashClient } from "../client.js";
declare const schema: z.ZodObject<{
    instance: z.ZodString;
    featureName: z.ZodString;
    environment: z.ZodString;
    strategyId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        contextName: z.ZodString;
        operator: z.ZodString;
        values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        value: z.ZodOptional<z.ZodString>;
        inverted: z.ZodOptional<z.ZodBoolean>;
        caseInsensitive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        contextName: string;
        operator: string;
        value?: string | undefined;
        values?: string[] | undefined;
        inverted?: boolean | undefined;
        caseInsensitive?: boolean | undefined;
    }, {
        contextName: string;
        operator: string;
        value?: string | undefined;
        values?: string[] | undefined;
        inverted?: boolean | undefined;
        caseInsensitive?: boolean | undefined;
    }>, "many">>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        weight: z.ZodNumber;
        weightType: z.ZodOptional<z.ZodString>;
        stickiness: z.ZodOptional<z.ZodString>;
        payload: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            type: string;
        }, {
            value: string;
            type: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        weight: number;
        weightType?: string | undefined;
        stickiness?: string | undefined;
        payload?: {
            value: string;
            type: string;
        } | undefined;
    }, {
        name: string;
        weight: number;
        weightType?: string | undefined;
        stickiness?: string | undefined;
        payload?: {
            value: string;
            type: string;
        } | undefined;
    }>, "many">>;
    segments: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    project: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instance: string;
    featureName: string;
    environment: string;
    strategyId: string;
    name?: string | undefined;
    title?: string | undefined;
    disabled?: boolean | undefined;
    sortOrder?: number | undefined;
    parameters?: Record<string, unknown> | undefined;
    constraints?: {
        contextName: string;
        operator: string;
        value?: string | undefined;
        values?: string[] | undefined;
        inverted?: boolean | undefined;
        caseInsensitive?: boolean | undefined;
    }[] | undefined;
    variants?: {
        name: string;
        weight: number;
        weightType?: string | undefined;
        stickiness?: string | undefined;
        payload?: {
            value: string;
            type: string;
        } | undefined;
    }[] | undefined;
    segments?: number[] | undefined;
    project?: string | undefined;
}, {
    instance: string;
    featureName: string;
    environment: string;
    strategyId: string;
    name?: string | undefined;
    title?: string | undefined;
    disabled?: boolean | undefined;
    sortOrder?: number | undefined;
    parameters?: Record<string, unknown> | undefined;
    constraints?: {
        contextName: string;
        operator: string;
        value?: string | undefined;
        values?: string[] | undefined;
        inverted?: boolean | undefined;
        caseInsensitive?: boolean | undefined;
    }[] | undefined;
    variants?: {
        name: string;
        weight: number;
        weightType?: string | undefined;
        stickiness?: string | undefined;
        payload?: {
            value: string;
            type: string;
        } | undefined;
    }[] | undefined;
    segments?: number[] | undefined;
    project?: string | undefined;
}>;
declare function handler(client: UnleashClient, args: z.infer<typeof schema>): Promise<import("@mcp-toolbox/shared").McpToolResponse>;
export declare const updateFeatureStrategyTool: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        instance: z.ZodString;
        featureName: z.ZodString;
        environment: z.ZodString;
        strategyId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        constraints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            contextName: z.ZodString;
            operator: z.ZodString;
            values: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            value: z.ZodOptional<z.ZodString>;
            inverted: z.ZodOptional<z.ZodBoolean>;
            caseInsensitive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            contextName: string;
            operator: string;
            value?: string | undefined;
            values?: string[] | undefined;
            inverted?: boolean | undefined;
            caseInsensitive?: boolean | undefined;
        }, {
            contextName: string;
            operator: string;
            value?: string | undefined;
            values?: string[] | undefined;
            inverted?: boolean | undefined;
            caseInsensitive?: boolean | undefined;
        }>, "many">>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            weight: z.ZodNumber;
            weightType: z.ZodOptional<z.ZodString>;
            stickiness: z.ZodOptional<z.ZodString>;
            payload: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                value: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                type: string;
            }, {
                value: string;
                type: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            weight: number;
            weightType?: string | undefined;
            stickiness?: string | undefined;
            payload?: {
                value: string;
                type: string;
            } | undefined;
        }, {
            name: string;
            weight: number;
            weightType?: string | undefined;
            stickiness?: string | undefined;
            payload?: {
                value: string;
                type: string;
            } | undefined;
        }>, "many">>;
        segments: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        project: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instance: string;
        featureName: string;
        environment: string;
        strategyId: string;
        name?: string | undefined;
        title?: string | undefined;
        disabled?: boolean | undefined;
        sortOrder?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        constraints?: {
            contextName: string;
            operator: string;
            value?: string | undefined;
            values?: string[] | undefined;
            inverted?: boolean | undefined;
            caseInsensitive?: boolean | undefined;
        }[] | undefined;
        variants?: {
            name: string;
            weight: number;
            weightType?: string | undefined;
            stickiness?: string | undefined;
            payload?: {
                value: string;
                type: string;
            } | undefined;
        }[] | undefined;
        segments?: number[] | undefined;
        project?: string | undefined;
    }, {
        instance: string;
        featureName: string;
        environment: string;
        strategyId: string;
        name?: string | undefined;
        title?: string | undefined;
        disabled?: boolean | undefined;
        sortOrder?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        constraints?: {
            contextName: string;
            operator: string;
            value?: string | undefined;
            values?: string[] | undefined;
            inverted?: boolean | undefined;
            caseInsensitive?: boolean | undefined;
        }[] | undefined;
        variants?: {
            name: string;
            weight: number;
            weightType?: string | undefined;
            stickiness?: string | undefined;
            payload?: {
                value: string;
                type: string;
            } | undefined;
        }[] | undefined;
        segments?: number[] | undefined;
        project?: string | undefined;
    }>;
    handler: typeof handler;
};
export {};
//# sourceMappingURL=update-feature-strategy.d.ts.map