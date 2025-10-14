export class SpotifyClient {
    tokenProvider;
    baseUrl = "https://api.spotify.com/v1";
    constructor(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    async request(endpoint, options = {}) {
        const token = await this.tokenProvider.getAccessToken();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: options.method || "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            ...(options.body && { body: options.body }),
        });
        if (!response.ok) {
            const error = (await response.json());
            throw new Error(`Spotify API error (${error.error.status}): ${error.error.message}`);
        }
        if (response.status === 204) {
            return {};
        }
        return response.json();
    }
    async getTopTracks(timeRange = "medium_term", limit = 20) {
        return this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    }
    async getTopArtists(timeRange = "medium_term", limit = 20) {
        return this.request(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    }
    async getRecentlyPlayed(limit = 50) {
        return this.request(`/me/player/recently-played?limit=${limit}`);
    }
    async getCurrentUser() {
        return this.request("/me");
    }
    async testConnection() {
        try {
            await this.getCurrentUser();
            return true;
        }
        catch {
            return false;
        }
    }
    async search(query, type = "track", limit = 5) {
        return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
    }
    async startPlayback(options, deviceId) {
        const endpoint = deviceId
            ? `/me/player/play?device_id=${deviceId}`
            : "/me/player/play";
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(options),
        });
    }
    async pausePlayback(deviceId) {
        const endpoint = deviceId
            ? `/me/player/pause?device_id=${deviceId}`
            : "/me/player/pause";
        return this.request(endpoint, { method: "PUT" });
    }
    async skipToNext(deviceId) {
        const endpoint = deviceId
            ? `/me/player/next?device_id=${deviceId}`
            : "/me/player/next";
        return this.request(endpoint, { method: "POST" });
    }
    async skipToPrevious(deviceId) {
        const endpoint = deviceId
            ? `/me/player/previous?device_id=${deviceId}`
            : "/me/player/previous";
        return this.request(endpoint, { method: "POST" });
    }
    async getCurrentPlayback() {
        try {
            return await this.request("/me/player");
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("204") &&
                error.message.includes("NO_ACTIVE_DEVICE")) {
                return null;
            }
            throw error;
        }
    }
    async setVolume(percent, deviceId) {
        const endpoint = deviceId
            ? `/me/player/volume?volume_percent=${percent}&device_id=${deviceId}`
            : `/me/player/volume?volume_percent=${percent}`;
        return this.request(endpoint, { method: "PUT" });
    }
    async addToQueue(uri, deviceId) {
        const endpoint = deviceId
            ? `/me/player/queue?uri=${encodeURIComponent(uri)}&device_id=${deviceId}`
            : `/me/player/queue?uri=${encodeURIComponent(uri)}`;
        return this.request(endpoint, { method: "POST" });
    }
    async getAvailableDevices() {
        const response = await this.request("/me/player/devices");
        return response.devices;
    }
}
//# sourceMappingURL=client.js.map