import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";
const schema = z.object({
    instance: z.string().describe("Name of the Unleash instance to use"),
    name: z.string().min(1).describe("Name of the feature flag"),
    project: z
        .string()
        .optional()
        .describe("Project name (uses instance default if not specified)"),
});
async function handler(client, args) {
    try {
        const { instance, name, project } = args;
        const unleashInstance = client.getInstance(instance);
        const projectName = client.getProjectName(unleashInstance, project);
        const result = await client.makeRequest(unleashInstance, `/projects/${projectName}/features/${name}`, {
            method: "DELETE",
        });
        if (!result) {
            return createErrorResponse("Failed to archive feature flag");
        }
        return createSuccessResponse(`🗄 Feature flag '${name}' archived successfully in ${instance} (${projectName} project)`);
    }
    catch (error) {
        console.error("Error archiving feature:", error);
        return createErrorResponse(`Failed to archive feature flag: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export const archiveFeatureTool = {
    name: "archive_feature",
    description: "Archive (soft delete) a feature flag when it's no longer needed. Archived flags are hidden from normal views but can be restored if needed.",
    schema,
    handler,
};
//# sourceMappingURL=archive-feature.js.map