import type { SpotifyTokenProvider } from "../token-provider.js";
import { type SpotifyConfig } from "./types.js";
export declare function getUserConfigPath(): string;
export declare function loadConfigFromFile(): SpotifyConfig | null;
export declare function loadTokenProviderFromConfig(): Promise<SpotifyTokenProvider>;
//# sourceMappingURL=loader.d.ts.map