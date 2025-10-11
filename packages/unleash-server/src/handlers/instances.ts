import {
	createErrorResponse,
	createSuccessResponse,
} from "@mcp-toolbox/shared";
import type { UnleashClient } from "../client.js";

export async function listInstancesHandler(client: UnleashClient) {
	try {
		const instances = client.getAllInstances().map((instance) => ({
			name: instance.name,
			url: instance.url,
			defaultProject: instance.project || "default",
		}));

		const instanceList = instances
			.map(
				(i) =>
					`**${i.name}**\n  URL: ${i.url}\n  Default Project: ${i.defaultProject}`,
			)
			.join("\n\n");

		return createSuccessResponse(
			`Available Unleash instances:\n\n${instanceList}`,
		);
	} catch (error) {
		console.error("Error listing instances:", error);
		return createErrorResponse("Failed to list instances");
	}
}
