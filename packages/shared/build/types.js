import { z } from "zod";
export const CoordinatesSchema = z.object({
	latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
	longitude: z
		.number()
		.min(-180)
		.max(180)
		.describe("Longitude of the location"),
});
export const StateCodeSchema = z
	.string()
	.length(2)
	.describe("Two-letter state code (e.g. CA, NY)");
//# sourceMappingURL=types.js.map
