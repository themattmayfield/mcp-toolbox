import { z } from "zod";
const schema = z.object({
    query: z
        .string()
        .describe("Song name and artist to search for (e.g., 'numb giveon' or 'bohemian rhapsody queen')"),
    deviceId: z
        .string()
        .optional()
        .describe("Spotify device ID to play on (optional)"),
});
async function handler(client, args) {
    try {
        const results = await client.search(args.query, "track", 5);
        if (!results.tracks || results.tracks.items.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ No tracks found matching "${args.query}". Try a different search.`,
                    },
                ],
            };
        }
        const track = results.tracks.items[0];
        await client.startPlayback({ uris: [track.uri] }, args.deviceId);
        return {
            content: [
                {
                    type: "text",
                    text: `🎵 Now playing:\n"${track.name}" by ${track.artists.map((a) => a.name).join(", ")}\nAlbum: ${track.album.name}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("NO_ACTIVE_DEVICE") ||
                error.message.includes("404")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "❌ No active Spotify device found.\n\n**Quick fix:**\n1. Open Spotify (app or web player)\n2. Play ANY song for a few seconds\n3. Then try this command again\n\n💡 Tip: Use spotify_get_devices to see all available devices",
                        },
                    ],
                };
            }
            if (error.message.includes("PREMIUM_REQUIRED")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "❌ Spotify Premium is required for playback control. Please upgrade your account.",
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
export const playTrackTool = {
    name: "spotify_play_track",
    description: "Search for a song and start playing it on Spotify. Requires an active Spotify device (phone, computer, or web player) and Spotify Premium. Example: 'numb giveon' or 'bohemian rhapsody queen'.",
    schema,
    handler,
};
//# sourceMappingURL=play-track.js.map