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
export declare function formatFeature(feature: UnleashFeature, filterEnvironment?: string): string;
export declare function formatFeatureList(features: UnleashFeature[], filterEnvironment?: string): string;
//# sourceMappingURL=formatters.d.ts.map