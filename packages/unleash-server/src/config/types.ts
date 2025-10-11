import { z } from "zod";

export const UnleashInstanceSchema = z.object({
	name: z.string().min(1, "Instance name is required"),
	url: z.string().url("Must be a valid URL"),
	token: z.string().min(1, "API token is required"),
	project: z.string().default("default"),
	timeout: z.number().default(10000),
	retries: z.number().default(3),
	environments: z
		.array(z.string())
		.optional()
		.describe("Available environments for this instance"),
	defaultEnvironment: z
		.string()
		.optional()
		.describe("Default environment to use for this instance"),
});

export const UnleashConfigSchema = z.object({
	instances: z
		.array(UnleashInstanceSchema)
		.min(1, "At least one instance is required"),
});

export type UnleashInstance = z.infer<typeof UnleashInstanceSchema>;
export type UnleashConfig = z.infer<typeof UnleashConfigSchema>;
