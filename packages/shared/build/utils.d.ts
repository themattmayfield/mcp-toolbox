import type { ApiRequestOptions, McpToolResponse } from "./types.js";
export declare function makeApiRequest<T>(
	url: string,
	options?: ApiRequestOptions,
): Promise<T | null>;
export declare function createErrorResponse(message: string): McpToolResponse;
export declare function createSuccessResponse(text: string): McpToolResponse;
export declare function formatCoordinates(
	lat: number,
	lon: number,
	precision?: number,
): string;
export declare function validateStateCode(state: string): string;
//# sourceMappingURL=utils.d.ts.map
