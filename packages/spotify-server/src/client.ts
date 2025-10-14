import type { SpotifyTokenProvider } from "./token-provider.js";
import type {
	PlaybackOptions,
	SpotifyArtist,
	SpotifyCursorPagingResponse,
	SpotifyDevice,
	SpotifyDevicesResponse,
	SpotifyErrorResponse,
	SpotifyPagingResponse,
	SpotifyPlaybackState,
	SpotifyPlayHistory,
	SpotifySearchResponse,
	SpotifyTrack,
	TimeRange,
} from "./types.js";

export class SpotifyClient {
	private readonly baseUrl = "https://api.spotify.com/v1";

	constructor(private tokenProvider: SpotifyTokenProvider) {}

	private async request<T>(
		endpoint: string,
		options: {
			method?: string;
			body?: string;
		} = {},
	): Promise<T> {
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
			const error = (await response.json()) as SpotifyErrorResponse;
			throw new Error(
				`Spotify API error (${error.error.status}): ${error.error.message}`,
			);
		}

		if (response.status === 204) {
			return {} as T;
		}

		return response.json() as Promise<T>;
	}

	async getTopTracks(
		timeRange: TimeRange = "medium_term",
		limit = 20,
	): Promise<SpotifyPagingResponse<SpotifyTrack>> {
		return this.request(
			`/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
		);
	}

	async getTopArtists(
		timeRange: TimeRange = "medium_term",
		limit = 20,
	): Promise<SpotifyPagingResponse<SpotifyArtist>> {
		return this.request(
			`/me/top/artists?time_range=${timeRange}&limit=${limit}`,
		);
	}

	async getRecentlyPlayed(
		limit = 50,
	): Promise<SpotifyCursorPagingResponse<SpotifyPlayHistory>> {
		return this.request(`/me/player/recently-played?limit=${limit}`);
	}

	async getCurrentUser(): Promise<{
		id: string;
		display_name: string;
		email: string;
		country: string;
	}> {
		return this.request("/me");
	}

	async testConnection(): Promise<boolean> {
		try {
			await this.getCurrentUser();
			return true;
		} catch {
			return false;
		}
	}

	async search(
		query: string,
		type: "track" | "artist" | "album" = "track",
		limit = 5,
	): Promise<SpotifySearchResponse> {
		return this.request(
			`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
		);
	}

	async startPlayback(
		options: PlaybackOptions,
		deviceId?: string,
	): Promise<void> {
		const endpoint = deviceId
			? `/me/player/play?device_id=${deviceId}`
			: "/me/player/play";

		return this.request(endpoint, {
			method: "PUT",
			body: JSON.stringify(options),
		});
	}

	async pausePlayback(deviceId?: string): Promise<void> {
		const endpoint = deviceId
			? `/me/player/pause?device_id=${deviceId}`
			: "/me/player/pause";

		return this.request(endpoint, { method: "PUT" });
	}

	async skipToNext(deviceId?: string): Promise<void> {
		const endpoint = deviceId
			? `/me/player/next?device_id=${deviceId}`
			: "/me/player/next";

		return this.request(endpoint, { method: "POST" });
	}

	async skipToPrevious(deviceId?: string): Promise<void> {
		const endpoint = deviceId
			? `/me/player/previous?device_id=${deviceId}`
			: "/me/player/previous";

		return this.request(endpoint, { method: "POST" });
	}

	async getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
		try {
			return await this.request("/me/player");
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("204") &&
				error.message.includes("NO_ACTIVE_DEVICE")
			) {
				return null;
			}
			throw error;
		}
	}

	async setVolume(percent: number, deviceId?: string): Promise<void> {
		const endpoint = deviceId
			? `/me/player/volume?volume_percent=${percent}&device_id=${deviceId}`
			: `/me/player/volume?volume_percent=${percent}`;

		return this.request(endpoint, { method: "PUT" });
	}

	async addToQueue(uri: string, deviceId?: string): Promise<void> {
		const endpoint = deviceId
			? `/me/player/queue?uri=${encodeURIComponent(uri)}&device_id=${deviceId}`
			: `/me/player/queue?uri=${encodeURIComponent(uri)}`;

		return this.request(endpoint, { method: "POST" });
	}

	async getAvailableDevices(): Promise<SpotifyDevice[]> {
		const response =
			await this.request<SpotifyDevicesResponse>("/me/player/devices");
		return response.devices;
	}
}
