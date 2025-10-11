/**
 * Formats Unleash feature flags and feature lists for display.
 *
 * Provides human-readable formatting with:
 * - Status indicators (enabled/disabled/archived)
 * - Environment-specific status when filtering
 * - Summary statistics (active, disabled, archived, stale counts)
 * - Date formatting and metadata
 *
 * Used by tools that display feature flag information to users.
 */

import type { UnleashFeature } from "./types.js";

export function formatFeature(
	feature: UnleashFeature,
	filterEnvironment?: string,
): string {
	let status: string;

	if (feature.archived) {
		status = "🗄 ARCHIVED";
	} else if (filterEnvironment) {
		const envStatus = feature.environments.find(
			(env) => env.name === filterEnvironment,
		);
		status = envStatus?.enabled ? "✅ ENABLED" : "❌ DISABLED";
	} else {
		status = feature.enabled ? "✅ ENABLED" : "❌ DISABLED";
	}

	const envStatus = feature.environments
		.map((env) => `${env.name}: ${env.enabled ? "✅" : "❌"}`)
		.join(", ");

	return [
		`**${feature.name}** (${feature.type}) ${status}`,
		feature.description ? `Description: ${feature.description}` : "",
		`Project: ${feature.project}`,
		`Environments: ${envStatus}`,
		`Created: ${new Date(feature.createdAt).toLocaleDateString()}`,
		feature.lastSeenAt
			? `Last seen: ${new Date(feature.lastSeenAt).toLocaleDateString()}`
			: "",
		feature.stale ? "! STALE" : "",
		"---",
	]
		.filter(Boolean)
		.join("\n");
}

export function formatFeatureList(
	features: UnleashFeature[],
	filterEnvironment?: string,
): string {
	if (features.length === 0) {
		return "No features found.";
	}

	let activeCount: number, disabledCount: number;

	if (filterEnvironment) {
		activeCount = features.filter((f) => {
			if (f.archived) return false;
			const envStatus = f.environments.find(
				(env) => env.name === filterEnvironment,
			);
			return envStatus?.enabled || false;
		}).length;

		disabledCount = features.filter((f) => {
			if (f.archived) return false;
			const envStatus = f.environments.find(
				(env) => env.name === filterEnvironment,
			);
			return !envStatus?.enabled;
		}).length;
	} else {
		activeCount = features.filter((f) => !f.archived && f.enabled).length;
		disabledCount = features.filter((f) => !f.archived && !f.enabled).length;
	}

	const summary = [
		`Found ${features.length} feature flag(s):`,
		`- Active: ${activeCount}`,
		`- Disabled: ${disabledCount}`,
		`- Archived: ${features.filter((f) => f.archived).length}`,
		`- Stale: ${features.filter((f) => f.stale).length}`,
		"",
	].join("\n");

	const featureList = features
		.map((feature) => formatFeature(feature, filterEnvironment))
		.join("\n");

	return summary + featureList;
}
