import { z } from "zod";
const schema = z.object({
    deviceId: z
        .string()
        .optional()
        .describe("Spotify device ID to skip on (optional)"),
});
async function handler(client, args) {
    try {
        await client.skipToPrevious(args.deviceId);
        return {
            content: [
                {
                    type: "text",
                    text: "⏮️ Skipped to previous track",
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("NO_ACTIVE_DEVICE")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "❌ No active Spotify device found.",
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ Error: ${error.message}`,
                    },
                ],
            };
        }
        throw error;
    }
}
export const skipToPreviousTool = {
    name: "spotify_previous",
    description: "Skip to the previous track on Spotify. Requires an active Spotify device and Premium.",
    schema,
    handler,
};
//# sourceMappingURL=skip-to-previous.js.map