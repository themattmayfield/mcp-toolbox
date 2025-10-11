#!/usr/bin/env node
/**
 * Interactive setup wizard for configuring Unleash server connections.
 *
 * Guides users through:
 * - Connecting to one or more Unleash instances (production, staging, etc.)
 * - Testing connections and discovering available projects/environments
 * - Selecting which environments to work with
 * - Saving configuration to files or generating environment variable snippets
 *
 * Run with: bun run setup
 */
declare class InteractiveSetup {
    private instances;
    run(): Promise<void>;
    private handleExistingConfig;
    private setupInstance;
    private askAddAnother;
    private showSummary;
    private saveConfiguration;
    private showNextSteps;
    private editExistingInstances;
    private testAllConnections;
    private showCurrentConfig;
}
export { InteractiveSetup };
//# sourceMappingURL=setup.d.ts.map