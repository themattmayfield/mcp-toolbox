import type { ApiRequestOptions, McpToolResponse } from "./types.js";

export async function makeApiRequest<T>(
	url: string,
	options: ApiRequestOptions = {},
): Promise<T | null> {
	const {
		headers = {},
		timeout = 10000,
		retries = 3,
		method = "GET",
		body,
	} = options;

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const fetchOptions: RequestInit = {
				method,
				headers,
				signal: controller.signal,
			};

			if (body) {
				fetchOptions.body = body;
			}

			const response = await fetch(url, fetchOptions);

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Handle empty responses (like DELETE requests)
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return (await response.json()) as T;
			} else {
				// Return a generic success response for non-JSON responses
				return {} as T;
			}
		} catch (error) {
			console.error(`API request attempt ${attempt} failed:`, error);

			if (attempt === retries) {
				return null;
			}

			// Exponential backoff
			await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
		}
	}

	return null;
}

export function createErrorResponse(message: string): McpToolResponse {
	return {
		content: [
			{
				type: "text",
				text: message,
			},
		],
	};
}

export function createSuccessResponse(text: string): McpToolResponse {
	return {
		content: [
			{
				type: "text",
				text,
			},
		],
	};
}

export function formatCoordinates(
	lat: number,
	lon: number,
	precision = 4,
): string {
	return `${lat.toFixed(precision)},${lon.toFixed(precision)}`;
}

export function validateStateCode(state: string): string {
	return state.toUpperCase().trim();
}
