export interface UnleashFeature {
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
}
export interface UnleashEnvironment {
    name: string;
    type: string;
    enabled: boolean;
    protected: boolean;
    sortOrder: number;
}
export interface UnleashFeatureEnvironment {
    enabled: boolean;
    strategies?: Array<{
        name: string;
        parameters?: Record<string, unknown>;
    }>;
}
export interface UnleashProject {
    id: string;
    name: string;
}
export interface UnleashProjectsResponse {
    projects: UnleashProject[];
}
export interface UnleashEnvironmentsResponse {
    environments: UnleashEnvironment[];
}
export interface UnleashFeaturesResponse {
    features: UnleashFeature[];
}
//# sourceMappingURL=types.d.ts.map