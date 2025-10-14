import { z } from "zod";
const schema = z.object({});
async function handler(client, _args) {
    const playback = await client.getCurrentPlayback();
    if (!playback || !playback.item) {
        return {
            content: [
                {
                    type: "text",
                    text: "🔇 Nothing is currently playing on Spotify",
                },
            ],
        };
    }
    const track = playback.item;
    const progress = Math.floor(playback.progress_ms / 1000);
    const duration = Math.floor(track.duration_ms / 1000);
    const progressMin = Math.floor(progress / 60);
    const progressSec = progress % 60;
    const durationMin = Math.floor(duration / 60);
    const durationSec = duration % 60;
    return {
        content: [
            {
                type: "text",
                text: `${playback.is_playing ? "▶️" : "⏸️"} Now ${playback.is_playing ? "playing" : "paused"}:\n"${track.name}" by ${track.artists.map((a) => a.name).join(", ")}\nAlbum: ${track.album.name}\nProgress: ${progressMin}:${progressSec.toString().padStart(2, "0")} / ${durationMin}:${durationSec.toString().padStart(2, "0")}\nDevice: ${playback.device.name}\nVolume: ${playback.device.volume_percent}%`,
            },
        ],
    };
}
export const getCurrentPlaybackTool = {
    name: "spotify_get_current_playback",
    description: "Get information about what's currently playing on Spotify, including track info, progress, device, and playback state.",
    schema,
    handler,
};
//# sourceMappingURL=get-current-playback.js.map