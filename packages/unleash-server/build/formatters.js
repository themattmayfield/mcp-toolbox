export function formatFeature(feature, filterEnvironment) {
    let status;
    if (feature.archived) {
        status = "🗄 ARCHIVED";
    }
    else if (filterEnvironment) {
        const envStatus = feature.environments.find((env) => env.name === filterEnvironment);
        status = envStatus?.enabled ? "✅ ENABLED" : "❌ DISABLED";
    }
    else {
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
        feature.stale ? "⚠️ STALE" : "",
        "---",
    ]
        .filter(Boolean)
        .join("\n");
}
export function formatFeatureList(features, filterEnvironment) {
    if (features.length === 0) {
        return "No features found.";
    }
    let activeCount, disabledCount;
    if (filterEnvironment) {
        activeCount = features.filter((f) => {
            if (f.archived)
                return false;
            const envStatus = f.environments.find((env) => env.name === filterEnvironment);
            return envStatus?.enabled || false;
        }).length;
        disabledCount = features.filter((f) => {
            if (f.archived)
                return false;
            const envStatus = f.environments.find((env) => env.name === filterEnvironment);
            return !envStatus?.enabled;
        }).length;
    }
    else {
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
//# sourceMappingURL=formatters.js.map