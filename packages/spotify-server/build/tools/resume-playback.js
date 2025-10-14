import { z } from "zod";
const schema = z.object({
    deviceId: z
        .string()
        .optional()
        .describe("Spotify device ID to resume on (optional)"),
});
async function handler(client, args) {
    try {
        await client.startPlayback({}, args.deviceId);
        return {
            content: [
                {
                    type: "text",
                    text: "▶️ Playback resumed",
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
export const resumePlaybackTool = {
    name: "spotify_resume",
    description: "Resume the currently paused track on Spotify. Requires an active Spotify device and Premium.",
    schema,
    handler,
};
//# sourceMappingURL=resume-playback.js.map