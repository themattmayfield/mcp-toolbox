import type { SpotifyTokenProvider } from "./token-provider.js";
import type { PlaybackOptions, SpotifyArtist, SpotifyCursorPagingResponse, SpotifyDevice, SpotifyPagingResponse, SpotifyPlaybackState, SpotifyPlayHistory, SpotifySearchResponse, SpotifyTrack, TimeRange } from "./types.js";
export declare class SpotifyClient {
    private tokenProvider;
    private readonly baseUrl;
    constructor(tokenProvider: SpotifyTokenProvider);
    private request;
    getTopTracks(timeRange?: TimeRange, limit?: number): Promise<SpotifyPagingResponse<SpotifyTrack>>;
    getTopArtists(timeRange?: TimeRange, limit?: number): Promise<SpotifyPagingResponse<SpotifyArtist>>;
    getRecentlyPlayed(limit?: number): Promise<SpotifyCursorPagingResponse<SpotifyPlayHistory>>;
    getCurrentUser(): Promise<{
        id: string;
        display_name: string;
        email: string;
        country: string;
    }>;
    testConnection(): Promise<boolean>;
    search(query: string, type?: "track" | "artist" | "album", limit?: number): Promise<SpotifySearchResponse>;
    startPlayback(options: PlaybackOptions, deviceId?: string): Promise<void>;
    pausePlayback(deviceId?: string): Promise<void>;
    skipToNext(deviceId?: string): Promise<void>;
    skipToPrevious(deviceId?: string): Promise<void>;
    getCurrentPlayback(): Promise<SpotifyPlaybackState | null>;
    setVolume(percent: number, deviceId?: string): Promise<void>;
    addToQueue(uri: string, deviceId?: string): Promise<void>;
    getAvailableDevices(): Promise<SpotifyDevice[]>;
}
//# sourceMappingURL=client.d.ts.map