import { z } from "zod";

export interface McpToolResponse {
	[x: string]: unknown;
	content: Array<{
		type: "text";
		text: string;
	}>;
}

export interface McpServerConfig {
	name: string;
	version: string;
	description?: string;
}

export interface ApiRequestOptions {
	headers?: Record<string, string>;
	timeout?: number;
	retries?: number;
	method?: string;
	body?: string;
}

export const CoordinatesSchema = z.object({
	latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
	longitude: z
		.number()
		.min(-180)
		.max(180)
		.describe("Longitude of the location"),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const StateCodeSchema = z
	.string()
	.length(2)
	.describe("Two-letter state code (e.g. CA, NY)");

export type StateCode = z.infer<typeof StateCodeSchema>;
