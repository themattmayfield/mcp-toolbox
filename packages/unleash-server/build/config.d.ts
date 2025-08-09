import { z } from "zod";
export declare const UnleashInstanceSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodString;
    token: z.ZodString;
    project: z.ZodDefault<z.ZodString>;
    timeout: z.ZodDefault<z.ZodNumber>;
    retries: z.ZodDefault<z.ZodNumber>;
    environments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    defaultEnvironment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    url: string;
    token: string;
    project: string;
    timeout: number;
    retries: number;
    environments?: string[] | undefined;
    defaultEnvironment?: string | undefined;
}, {
    name: string;
    url: string;
    token: string;
    project?: string | undefined;
    timeout?: number | undefined;
    retries?: number | undefined;
    environments?: string[] | undefined;
    defaultEnvironment?: string | undefined;
}>;
export declare const UnleashConfigSchema: z.ZodObject<{
    instances: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        token: z.ZodString;
        project: z.ZodDefault<z.ZodString>;
        timeout: z.ZodDefault<z.ZodNumber>;
        retries: z.ZodDefault<z.ZodNumber>;
        environments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        defaultEnvironment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
        token: string;
        project: string;
        timeout: number;
        retries: number;
        environments?: string[] | undefined;
        defaultEnvironment?: string | undefined;
    }, {
        name: string;
        url: string;
        token: string;
        project?: string | undefined;
        timeout?: number | undefined;
        retries?: number | undefined;
        environments?: string[] | undefined;
        defaultEnvironment?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    instances: {
        name: string;
        url: string;
        token: string;
        project: string;
        timeout: number;
        retries: number;
        environments?: string[] | undefined;
        defaultEnvironment?: string | undefined;
    }[];
}, {
    instances: {
        name: string;
        url: string;
        token: string;
        project?: string | undefined;
        timeout?: number | undefined;
        retries?: number | undefined;
        environments?: string[] | undefined;
        defaultEnvironment?: string | undefined;
    }[];
}>;
export type UnleashInstance = z.infer<typeof UnleashInstanceSchema>;
export type UnleashConfig = z.infer<typeof UnleashConfigSchema>;
export declare function getConfigPaths(): string[];
export declare function getUserConfigPath(): string;
export declare function loadConfigFromFile(): UnleashConfig | null;
export declare function loadConfigFromEnv(): UnleashConfig | null;
export declare function loadConfig(): UnleashConfig;
export declare function saveConfigToFile(config: UnleashConfig, configPath?: string): void;
export declare function generateEnvVariables(config: UnleashConfig): string;
export declare function generateClaudeDesktopConfig(config: UnleashConfig): string;
//# sourceMappingURL=config.d.ts.map