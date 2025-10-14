import { z } from "zod";
import type { SpotifyClient } from "../client.js";
import type { SpotifyDevice } from "../types.js";

const schema = z.object({});

async function handler(client: SpotifyClient, _args: z.infer<typeof schema>) {
	try {
		const devices = await client.getAvailableDevices();

		if (!devices || devices.length === 0) {
			return {
				content: [
					{
						type: "text" as const,
						text: "❌ No Spotify devices found.\n\n**To fix this:**\n1. Open Spotify on your device\n2. Play any song (even for a second)\n3. The device will then be available for remote control\n\n**Note:** Just having Spotify open isn't enough - you need to start playback at least once.",
					},
				],
			};
		}

		const deviceList = devices
			.map((device: SpotifyDevice) => {
				const activeIcon = device.is_active ? "✅" : "⚪";
				return `${activeIcon} ${device.name}\n   Type: ${device.type}\n   ID: ${device.id}\n   Volume: ${device.volume_percent}%\n   Active: ${device.is_active ? "Yes" : "No"}`;
			})
			.join("\n\n");

		const activeDevices = devices.filter((d: SpotifyDevice) => d.is_active);

		return {
			content: [
				{
					type: "text" as const,
					text: `📱 Available Spotify Devices:\n\n${deviceList}\n\n${activeDevices.length > 0 ? `Active device: ${activeDevices[0].name}` : "⚠️ No active device - start playing something on one of these devices first"}`,
				},
			],
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				content: [
					{
						type: "text" as const,
						text: `❌ Error getting devices: ${error.message}`,
					},
				],
			};
		}
		throw error;
	}
}

export const getDevicesTool = {
	name: "spotify_get_devices",
	description:
		"List all available Spotify devices (phones, computers, speakers) and show which one is currently active. Useful for troubleshooting playback issues.",
	schema,
	handler,
};
