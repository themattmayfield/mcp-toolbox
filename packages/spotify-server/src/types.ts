export type SpotifyImage = {
	url: string;
	height: number;
	width: number;
};

export type SpotifyArtist = {
	id: string;
	name: string;
	uri: string;
	href: string;
	external_urls: {
		spotify: string;
	};
	images?: SpotifyImage[];
	genres?: string[];
};

export type SpotifyAlbum = {
	id: string;
	name: string;
	uri: string;
	href: string;
	album_type: string;
	release_date: string;
	images: SpotifyImage[];
	artists: SpotifyArtist[];
	external_urls: {
		spotify: string;
	};
};

export type SpotifyTrack = {
	id: string;
	name: string;
	uri: string;
	href: string;
	duration_ms: number;
	explicit: boolean;
	popularity: number;
	preview_url: string | null;
	track_number: number;
	artists: SpotifyArtist[];
	album: SpotifyAlbum;
	external_urls: {
		spotify: string;
	};
};

export type SpotifyPlayHistory = {
	track: SpotifyTrack;
	played_at: string;
	context: {
		type: string;
		href: string;
		uri: string;
	} | null;
};

export type TimeRange = "short_term" | "medium_term" | "long_term";

export type SpotifyPagingResponse<T> = {
	href: string;
	items: T[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
};

export type SpotifyCursorPagingResponse<T> = {
	href: string;
	items: T[];
	limit: number;
	next: string | null;
	cursors: {
		after: string;
		before: string;
	};
};

export type SpotifyErrorResponse = {
	error: {
		status: number;
		message: string;
	};
};

export type SpotifyDevice = {
	id: string;
	is_active: boolean;
	is_private_session: boolean;
	is_restricted: boolean;
	name: string;
	type: string;
	volume_percent: number;
};

export type SpotifyPlaybackState = {
	device: SpotifyDevice;
	repeat_state: string;
	shuffle_state: boolean;
	timestamp: number;
	progress_ms: number;
	is_playing: boolean;
	item: SpotifyTrack | null;
	currently_playing_type: string;
};

export type SpotifySearchResponse = {
	tracks?: SpotifyPagingResponse<SpotifyTrack>;
	artists?: SpotifyPagingResponse<SpotifyArtist>;
	albums?: SpotifyPagingResponse<SpotifyAlbum>;
};

export type PlaybackOptions = {
	uris?: string[];
	context_uri?: string;
	offset?: {
		position?: number;
		uri?: string;
	};
	position_ms?: number;
};

export type SpotifyDevicesResponse = {
	devices: SpotifyDevice[];
};
