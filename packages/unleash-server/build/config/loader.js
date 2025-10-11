/**
 * Loads Unleash server configuration from environment variables or config files.
 *
 * Configuration is loaded in this order of precedence:
 * 1. Environment variables (UNLEASH_URL, UNLEASH_TOKEN, or UNLEASH_INSTANCES JSON)
 * 2. Local config file (./unleash-config.json)
 * 3. User config file (~/.config/mcp-toolbox/unleash.json)
 * 4. System config file (/etc/mcp-toolbox/unleash.json)
 *
 * Supports both single instance and multi-instance configurations.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { UnleashConfigSchema, UnleashInstanceSchema } from "./types.js";
const CONFIG_PATHS = [
    "./unleash-toolbox.json",
    join(homedir(), ".config", "mcp-toolbox", "unleash-toolbox.json"),
    "/etc/mcp-toolbox/unleash-toolbox.json",
];
export function getUserConfigPath() {
    return CONFIG_PATHS[1];
}
export function loadConfigFromFile() {
    for (const configPath of CONFIG_PATHS) {
        if (existsSync(configPath)) {
            try {
                const configData = readFileSync(configPath, "utf8");
                const config = JSON.parse(configData);
                return UnleashConfigSchema.parse(config);
            }
            catch (error) {
                console.error(`Error loading config from ${configPath}:`, error);
            }
        }
    }
    return null;
}
function loadConfigFromEnv() {
    if (process.env.UNLEASH_INSTANCES) {
        try {
            const instances = JSON.parse(process.env.UNLEASH_INSTANCES);
            return UnleashConfigSchema.parse({ instances });
        }
        catch (error) {
            console.error("Error parsing UNLEASH_INSTANCES:", error);
        }
    }
    const instances = [];
    if (process.env.UNLEASH_URL && process.env.UNLEASH_TOKEN) {
        instances.push({
            name: process.env.UNLEASH_NAME || "default",
            url: process.env.UNLEASH_URL,
            token: process.env.UNLEASH_TOKEN,
            project: process.env.UNLEASH_PROJECT || "default",
            timeout: process.env.UNLEASH_TIMEOUT
                ? parseInt(process.env.UNLEASH_TIMEOUT)
                : 10000,
            retries: process.env.UNLEASH_RETRIES
                ? parseInt(process.env.UNLEASH_RETRIES)
                : 3,
        });
    }
    let i = 0;
    while (process.env[`UNLEASH_${i}_URL`] && process.env[`UNLEASH_${i}_TOKEN`]) {
        const url = process.env[`UNLEASH_${i}_URL`];
        const token = process.env[`UNLEASH_${i}_TOKEN`];
        if (!url || !token)
            break;
        const timeoutStr = process.env[`UNLEASH_${i}_TIMEOUT`];
        const retriesStr = process.env[`UNLEASH_${i}_RETRIES`];
        const instance = {
            name: process.env[`UNLEASH_${i}_NAME`] || `instance-${i}`,
            url,
            token,
            project: process.env[`UNLEASH_${i}_PROJECT`] || "default",
            timeout: timeoutStr ? parseInt(timeoutStr) : 10000,
            retries: retriesStr ? parseInt(retriesStr) : 3,
        };
        try {
            instances.push(UnleashInstanceSchema.parse(instance));
        }
        catch (error) {
            console.error(`Error parsing instance ${i}:`, error);
        }
        i++;
    }
    if (instances.length > 0) {
        try {
            return UnleashConfigSchema.parse({ instances });
        }
        catch (error) {
            console.error("Error validating environment config:", error);
        }
    }
    return null;
}
export function loadConfig() {
    const envConfig = loadConfigFromEnv();
    if (envConfig) {
        return envConfig;
    }
    const fileConfig = loadConfigFromFile();
    if (fileConfig) {
        return fileConfig;
    }
    throw new Error("No Unleash configuration found. Please run 'bun run setup' to configure your instances, " +
        "or set environment variables (UNLEASH_URL, UNLEASH_TOKEN) or create a config file.");
}
//# sourceMappingURL=loader.js.map