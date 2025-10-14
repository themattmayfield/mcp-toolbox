export type SpotifyTokenProvider = {
    getAccessToken: () => Promise<string>;
    refreshToken?: () => Promise<string>;
};
export declare function loadTokenProvider(path: string): Promise<SpotifyTokenProvider>;
export declare function createEnvTokenProvider(): SpotifyTokenProvider;
//# sourceMappingURL=token-provider.d.ts.map