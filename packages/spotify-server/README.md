# @mcp-toolbox/spotify-server

MCP (Model Context Protocol) server for Spotify API integration with flexible token management. Lets you ask LLMs about your Spotify listening habits, control playback, and more.

## Features

### Listening Insights
- 🎵 **Get Top Tracks** - Your most played tracks (last 4 weeks, 6 months, or all time)
- 🎤 **Get Top Artists** - Your most listened artists with genres
- 🕐 **Recently Played** - Your listening history with timestamps

### Playback Control (Premium Required)
- ▶️ **Play Songs** - Search and play any track ("play numb by giveon")
- ⏸️ **Pause/Resume** - Control playback
- ⏭️ **Skip Tracks** - Next/previous track controls
- 📱 **Current Playback** - See what's playing with progress and device info
- 📱 **Device Management** - List and troubleshoot available devices

### Authentication
- 🔐 **OAuth with Auto-Refresh** - Tokens that never expire (recommended!)
- 🔐 **Flexible Auth** - Environment variables, files, or custom providers
- 🎯 **Type Safe** - Full TypeScript support

## Quick Start

### 1. Installation

```bash
npm install -g @mcp-toolbox/spotify-server
# or
npx @mcp-toolbox/spotify-server
```

### 2. Choose Your Authentication Method

#### Option A: OAuth with Auto-Refresh (Recommended - Never Expires!)

Get a refresh token once, and never worry about expiration again!

**Quick steps:**
1. Create a Spotify app at https://developer.spotify.com/dashboard
2. Get Client ID, Client Secret, and Refresh Token
3. Run `spotify-setup` and choose "OAuth with auto-refresh"

**Full guide:** See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions.

#### Option B: Quick Token (Expires in 1 hour)

For testing or quick setup, get a temporary token:

1. Visit the [Spotify Web Console](https://developer.spotify.com/console/put-play/)
2. Click "GET TOKEN" and select these scopes:
   - `user-read-recently-played`
   - `user-top-read`
   - `user-modify-playback-state` (for playback control)
   - `user-read-playback-state` (for playback control)
3. Copy the token

**Note:** You'll need to get a new token every hour with this method.

### 3. Run Setup

```bash
cd packages/spotify-server
bun run setup
```

Choose your authentication method:
- **OAuth with auto-refresh** - ✨ Recommended! Never expires
- **Environment Variable** - Quick but expires every hour
- **Custom Token Provider** - Advanced, for apps with existing auth

For OAuth setup, follow the [OAuth Setup Guide](./OAUTH_SETUP.md).

### 4. Configure Claude Desktop / OpenCode

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "npx",
      "args": ["-y", "@mcp-toolbox/spotify-server"],
      "env": {
        "SPOTIFY_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### OpenCode

Add to `opencode.json`:

```json
{
  "spotify": {
    "type": "local",
    "command": ["npx", "-y", "@mcp-toolbox/spotify-server@latest"],
    "env": {
      "SPOTIFY_ACCESS_TOKEN": "your_token_here"
    },
    "enabled": true
  }
}
```

### 5. Restart and Ask!

Restart Claude Desktop or OpenCode and try:

**Listening insights:**
- "What are my top 10 songs from the last month?"
- "Show me my most played artists"
- "What did I listen to recently?"
- "What genres do I listen to most?"

**Playback control:**
- "Play numb by giveon"
- "Pause the music"
- "Skip to the next song"
- "What's currently playing?"
- "Check my Spotify devices"

## Configuration Location

Config files are loaded in this order of precedence:

1. **Local config**: `./spotify-toolbox.json` (in current directory)
2. **User config**: `~/.config/mcp-toolbox/spotify-toolbox.json`
3. **System config**: `/etc/mcp-toolbox/spotify-toolbox.json`

The setup wizard saves to the user config path (#2).

### Example Config (OAuth)

```json
{
  "useEnvToken": false,
  "oauth": {
    "clientId": "your_client_id_here",
    "clientSecret": "your_client_secret_here",
    "refreshToken": "your_refresh_token_here"
  }
}
```

## Troubleshooting

### "No active device found" ⚠️ MOST COMMON ISSUE

**The Problem:** Spotify API requires a device to be actively playing, not just open.

**Quick Fix:**
1. Open Spotify (app or https://open.spotify.com)
2. **Play any song** for a few seconds
3. Try your command again

**Check Your Devices:**
Ask Claude: "Check my Spotify devices" or use `spotify_get_devices`

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed help.

### "401 Unauthorized"

Your token has expired. Get a new one from the [Spotify Console](https://developer.spotify.com/console/put-play/).

### "Premium Required"

Playback control requires Spotify Premium. Listening insights work for free users.

### "Insufficient client scope"

Your token doesn't have playback permissions. Get a new token with these scopes:
- `user-modify-playback-state`
- `user-read-playback-state`

## Use Cases

- 📊 **Music Analytics** - Ask Claude to analyze your listening patterns
- 🎼 **Playlist Ideas** - Generate playlists based on your top tracks
- 📅 **Listening Reports** - "What was my most played genre this month?"
- 🔍 **Discovery** - "Find similarities between my top artists"
- 📈 **Trends** - "How has my music taste changed over time?"
- 🎵 **Voice Control** - "Play my favorite song from last week"

## Documentation

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Complete OAuth refresh token guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Device and connection troubleshooting
- [PLAYBACK.md](./PLAYBACK.md) - Playback control guide
- [CHANGELOG.md](./CHANGELOG.md) - Version history

## Contributing

This is part of the [mcp-toolbox](https://github.com/yourusername/mcp-toolbox) monorepo. See the main README for contribution guidelines.

## License

MIT
