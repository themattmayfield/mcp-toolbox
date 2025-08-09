export async function makeApiRequest(url, options = {}) {
	const { headers = {}, timeout = 10000, retries = 3 } = options;
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);
			const response = await fetch(url, {
				headers,
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
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
export function createErrorResponse(message) {
	return {
		content: [
			{
				type: "text",
				text: message,
			},
		],
	};
}
export function createSuccessResponse(text) {
	return {
		content: [
			{
				type: "text",
				text,
			},
		],
	};
}
export function formatCoordinates(lat, lon, precision = 4) {
	return `${lat.toFixed(precision)},${lon.toFixed(precision)}`;
}
export function validateStateCode(state) {
	return state.toUpperCase().trim();
}
//# sourceMappingURL=utils.js.map
