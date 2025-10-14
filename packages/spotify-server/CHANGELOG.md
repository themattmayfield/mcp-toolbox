# @mcp-toolbox/spotify-server

## 0.1.0

### Added

- Initial release
- Spotify API MCP server with flexible token management

**Listening Insights Tools:**
  - `spotify_get_top_tracks` - Get user's top tracks
  - `spotify_get_top_artists` - Get user's top artists
  - `spotify_get_recently_played` - Get recently played tracks

**Playback Control Tools (Premium Required):**
  - `spotify_play_track` - Search and play any track
  - `spotify_pause` - Pause playback
  - `spotify_resume` - Resume playback
  - `spotify_next` - Skip to next track
  - `spotify_previous` - Skip to previous track
  - `spotify_get_current_playback` - Get current playback state
  - `spotify_get_devices` - List and troubleshoot available devices

**Authentication:**
- Token provider system supporting multiple auth methods:
  - **OAuth with refresh token** - Auto-refreshing tokens that never expire (recommended!)
  - Environment variable (`SPOTIFY_ACCESS_TOKEN`)
  - File-based tokens
  - Custom token providers
- Interactive setup wizard (`spotify-setup`)
- Example token providers (env, file, cookie template)
- Full TypeScript support
- Comprehensive documentation:
  - `OAUTH_SETUP.md` - Complete OAuth refresh token guide
  - `TROUBLESHOOTING.md` - Device and connection troubleshooting
  - `PLAYBACK.md` - Playback control guide
