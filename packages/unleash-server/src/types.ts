/**
 * TypeScript types for Unleash API responses and data structures.
 *
 * These types represent the shape of data returned from the Unleash Admin API.
 */

export type UnleashFeature = {
	name: string;
	type: string;
	description?: string;
	project: string;
	stale: boolean;
	archived: boolean;
	enabled: boolean;
	environments: Array<{
		name: string;
		enabled: boolean;
	}>;
	createdAt: string;
	lastSeenAt?: string;
};

export type UnleashEnvironment = {
	name: string;
	type: string;
	enabled: boolean;
	protected: boolean;
	sortOrder: number;
};

export type UnleashFeatureEnvironment = {
	enabled: boolean;
	strategies?: Array<{
		name: string;
		parameters?: Record<string, unknown>;
	}>;
};

export type UnleashProject = {
	id: string;
	name: string;
};

export type UnleashProjectsResponse = {
	projects: UnleashProject[];
};

export type UnleashEnvironmentsResponse = {
	environments: UnleashEnvironment[];
};

export type UnleashFeaturesResponse = {
	features: UnleashFeature[];
};
