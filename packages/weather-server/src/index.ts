#!/usr/bin/env node

import {
	CoordinatesSchema,
	createErrorResponse,
	createMcpServer,
	createSuccessResponse,
	formatCoordinates,
	makeApiRequest,
	StateCodeSchema,
	validateStateCode,
} from "@mcp-toolbox/shared";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

interface AlertFeature {
	properties: {
		event?: string;
		areaDesc?: string;
		severity?: string;
		status?: string;
		headline?: string;
	};
}

interface ForecastPeriod {
	name?: string;
	temperature?: number;
	temperatureUnit?: string;
	windSpeed?: string;
	windDirection?: string;
	shortForecast?: string;
}

interface AlertsResponse {
	features: AlertFeature[];
}

interface PointsResponse {
	properties: {
		forecast?: string;
	};
}

interface ForecastResponse {
	properties: {
		periods: ForecastPeriod[];
	};
}

// Pure functions for business logic
const makeNWSRequest = <T>(url: string): Promise<T | null> =>
	makeApiRequest<T>(url, {
		headers: {
			"User-Agent": USER_AGENT,
			Accept: "application/geo+json",
		},
		timeout: 10000,
		retries: 3,
	});

const formatAlert = (feature: AlertFeature): string => {
	const props = feature.properties;
	return [
		`Event: ${props.event || "Unknown"}`,
		`Area: ${props.areaDesc || "Unknown"}`,
		`Severity: ${props.severity || "Unknown"}`,
		`Status: ${props.status || "Unknown"}`,
		`Headline: ${props.headline || "No headline"}`,
		"---",
	].join("\n");
};

async function main() {
	const { server, start } = createMcpServer({
		name: "weather",
		version: "1.0.0",
		description: "Weather data using the National Weather Service API",
	});

	// Register weather tools
	server.tool(
		"get_alerts",
		"Get weather alerts for a state",
		{
			state: StateCodeSchema,
		},
		async ({ state }) => {
			try {
				const stateCode = validateStateCode(state);
				const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
				const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

				if (!alertsData) {
					return createErrorResponse("Failed to retrieve alerts data");
				}

				const features = alertsData.features || [];
				if (features.length === 0) {
					return createSuccessResponse(`No active alerts for ${stateCode}`);
				}

				const formattedAlerts = features.map(formatAlert);
				const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

				return createSuccessResponse(alertsText);
			} catch (error) {
				console.error("Error in get_alerts:", error);
				return createErrorResponse("Failed to get weather alerts");
			}
		},
	);

	server.tool(
		"get_forecast",
		"Get weather forecast for a location",
		{
			latitude: CoordinatesSchema.shape.latitude,
			longitude: CoordinatesSchema.shape.longitude,
		},
		async ({ latitude, longitude }) => {
			try {
				const coordsString = formatCoordinates(latitude, longitude);
				const pointsUrl = `${NWS_API_BASE}/points/${coordsString}`;
				const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

				if (!pointsData) {
					return createErrorResponse(
						`Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
					);
				}

				const forecastUrl = pointsData.properties?.forecast;
				if (!forecastUrl) {
					return createErrorResponse(
						"Failed to get forecast URL from grid point data",
					);
				}

				const forecastData =
					await makeNWSRequest<ForecastResponse>(forecastUrl);
				if (!forecastData) {
					return createErrorResponse("Failed to retrieve forecast data");
				}

				const periods = forecastData.properties?.periods || [];
				if (periods.length === 0) {
					return createErrorResponse("No forecast periods available");
				}

				const formattedForecast = periods.map((period: ForecastPeriod) =>
					[
						`${period.name || "Unknown"}:`,
						`Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
						`Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
						`${period.shortForecast || "No forecast available"}`,
						"---",
					].join("\n"),
				);

				const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;
				return createSuccessResponse(forecastText);
			} catch (error) {
				console.error("Error in get_forecast:", error);
				return createErrorResponse("Failed to get weather forecast");
			}
		},
	);

	await start();
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
