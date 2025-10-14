import { z } from "zod";
const schema = z.object({
    deviceId: z
        .string()
        .optional()
        .describe("Spotify device ID to skip on (optional)"),
});
async function handler(client, args) {
    try {
        await client.skipToNext(args.deviceId);
        return {
            content: [
                {
                    type: "text",
                    text: "⏭️ Skipped to next track",
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
export const skipToNextTool = {
    name: "spotify_next",
    description: "Skip to the next track in the queue on Spotify. Requires an active Spotify device and Premium.",
    schema,
    handler,
};
//# sourceMappingURL=skip-to-next.js.map