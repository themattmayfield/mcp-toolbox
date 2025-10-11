import { createErrorResponse, createSuccessResponse, } from "@mcp-toolbox/shared";
import { z } from "zod";

const schema = z.object({});
async function handler(client) {
    try {
        const instances = client.getAllInstances().map((instance) => ({
            name: instance.name,
            url: instance.url,
            defaultProject: instance.project || "default",
        }));
        const instanceList = instances
            .map((i) => `**${i.name}**\n  URL: ${i.url}\n  Default Project: ${i.defaultProject}`)
            .join("\n\n");
        return createSuccessResponse(`Available Unleash instances:\n\n${instanceList}`);
    }
    catch (error) {
        console.error("Error listing instances:", error);
        return createErrorResponse("Failed to list instances");
    }
}
export const listInstancesTool = {
    name: "list_instances",
    description: "Show all configured Unleash server instances (e.g., production, staging, development). Use this to see what instances are available.",
    schema,
    handler,
};
//# sourceMappingURL=list-instances.js.map