import { z } from "zod";

export const InstanceNameSchema = z
	.string()
	.describe("Name of the Unleash instance to use");

export const FeatureNameSchema = z
	.string()
	.min(1)
	.describe("Name of the feature flag");

export const ProjectNameSchema = z
	.string()
	.optional()
	.describe("Project name (uses instance default if not specified)");

export const EnvironmentNameSchema = z
	.string()
	.optional()
	.describe("Environment name (optional filter)");

export const CreateFeatureSchema = z.object({
	instance: InstanceNameSchema,
	name: FeatureNameSchema,
	description: z.string().optional().describe("Feature flag description"),
	type: z
		.enum(["release", "experiment", "operational", "kill-switch", "permission"])
		.default("release")
		.describe("Type of feature flag"),
	project: ProjectNameSchema,
});

export const ArchiveFeatureSchema = z.object({
	instance: InstanceNameSchema,
	name: FeatureNameSchema,
	project: ProjectNameSchema,
});

export const ListFeaturesSchema = z.object({
	instance: InstanceNameSchema,
	project: ProjectNameSchema,
	environment: EnvironmentNameSchema,
});

export const GetFeatureStatusSchema = z.object({
	instance: InstanceNameSchema,
	name: FeatureNameSchema,
	project: ProjectNameSchema,
	environment: EnvironmentNameSchema,
});

export const ToggleFeatureSchema = z.object({
	instance: InstanceNameSchema,
	name: FeatureNameSchema,
	environment: z.string().describe("Environment name"),
	enabled: z.boolean().describe("Whether to enable or disable the feature"),
	project: ProjectNameSchema,
});

export const ListInstancesSchema = z.object({});

export const ListEnvironmentsSchema = z.object({
	instance: InstanceNameSchema,
	project: ProjectNameSchema,
});

export const ListAllFeaturesSchema = z.object({
	instance: InstanceNameSchema,
	project: ProjectNameSchema,
});
