import { makeApiRequest } from "@mcp-toolbox/shared";
import type { UnleashInstance } from "../config/types.js";
import type {
	UnleashEnvironmentsResponse,
	UnleashProjectsResponse,
} from "../types.js";

type ConnectionTestResult = {
	success: boolean;
	error?: string;
	projects?: string[];
	environments?: string[];
	tokenExpiry?: string;
};

/**
 * Tests connection to an Unleash server during interactive setup.
 *
 * Validates that:
 * - The server URL is reachable
 * - The API token is valid and authenticated
 * - The specified project exists and is accessible
 * - Available environments can be discovered
 *
 * Used by the setup wizard to provide immediate feedback before saving configuration.
 */

export async function testConnection(
	instance: Pick<UnleashInstance, "url" | "token"> & { project?: string },
): Promise<ConnectionTestResult> {
	try {
		const response = await makeApiRequest<UnleashProjectsResponse>(
			`${instance.url}/api/admin/projects`,
			{
				headers: {
					Authorization: instance.token,
					"Content-Type": "application/json",
				},
				timeout: 10000,
				retries: 1,
			},
		);

		if (!response) {
			return { success: false, error: "No response from server" };
		}

		const projects = response.projects?.map((p) => p.name || p.id) || [];

		const projectName = instance.project || "default";
		const projectResponse = await makeApiRequest(
			`${instance.url}/api/admin/projects/${projectName}`,
			{
				headers: {
					Authorization: instance.token,
					"Content-Type": "application/json",
				},
				timeout: 10000,
				retries: 1,
			},
		);

		if (!projectResponse) {
			return {
				success: false,
				error: `Cannot access project '${projectName}' - check project name and permissions`,
			};
		}

		let environments: string[] = [];
		try {
			const envResponse = await makeApiRequest<UnleashEnvironmentsResponse>(
				`${instance.url}/api/admin/environments`,
				{
					headers: {
						Authorization: instance.token,
						"Content-Type": "application/json",
					},
					timeout: 5000,
					retries: 1,
				},
			);
			environments = envResponse?.environments?.map((e) => e.name) || [];
		} catch {}

		return {
			success: true,
			projects,
			environments,
		};
	} catch (error) {
		let errorMessage = "Unknown error";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		if (errorMessage.includes("401") || errorMessage.includes("403")) {
			errorMessage = "Authentication failed - check your API token";
		} else if (errorMessage.includes("404")) {
			errorMessage = "Server not found - check your URL";
		} else if (
			errorMessage.includes("timeout") ||
			errorMessage.includes("ECONNREFUSED")
		) {
			errorMessage = "Connection timeout - check your URL and network";
		}

		return { success: false, error: errorMessage };
	}
}
