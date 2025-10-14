# Spotify Playback Control Guide

This guide explains how to use the playback control features of the Spotify MCP server.

## Requirements

1. **Spotify Premium** - Playback control requires a Premium subscription
2. **Active Device** - You must have Spotify open on at least one device:
   - Spotify desktop app (Mac/Windows/Linux)
   - Spotify mobile app (iOS/Android)
   - Spotify web player (open.spotify.com)
3. **Token Scopes** - Your access token needs these additional scopes:
   - `user-modify-playback-state`
   - `user-read-playback-state`

## Getting a Token with Playback Scopes

1. Visit: https://developer.spotify.com/console/put-play/
2. Click "GET TOKEN"
3. Select these scopes:
   - ✅ user-read-recently-played
   - ✅ user-top-read
   - ✅ user-modify-playback-state
   - ✅ user-read-playback-state
4. Click "REQUEST TOKEN"
5. Copy the token and use it in your setup

## Usage Examples

### Play a Song

```
User: "Play numb by giveon"
Claude: *searches and plays the track*
Response: 🎵 Now playing:
"Numb" by Giveon
Album: When It's All Said And Done
```

### Pause/Resume

```
User: "Pause the music"
Claude: ⏸️ Playback paused

User: "Resume"
Claude: ▶️ Playback resumed
```

### Skip Tracks

```
User: "Skip to the next song"
Claude: ⏭️ Skipped to next track

User: "Go back to the previous song"
Claude: ⏮️ Skipped to previous track
```

### Check What's Playing

```
User: "What's currently playing?"
Claude: ▶️ Now playing:
"Numb" by Giveon
Album: When It's All Said And Done
Progress: 1:23 / 3:45
Device: Matt's iPhone
Volume: 75%
```

## Natural Language Examples

The LLM can understand natural language commands:

- "Play some music by Giveon"
- "Put on Bohemian Rhapsody"
- "Skip this song"
- "What am I listening to?"
- "Pause my music"
- "Turn the music back on"

## Troubleshooting

### "No active Spotify device found"

**Solution:** Open Spotify on any device (phone, computer, web browser)

### "Spotify Premium is required"

**Solution:** Playback control only works with Spotify Premium. Upgrade at spotify.com/premium

### "401 Unauthorized" or Token Errors

**Solution:** Your token may be missing playback scopes or has expired. Generate a new token with all required scopes.

### Device Selection

By default, playback happens on your currently active device. To target a specific device:

```typescript
// In a custom implementation
spotify_play_track({ 
  query: "numb giveon",
  deviceId: "your-device-id"
})
```

To find device IDs, you can extend the client with a `getDevices()` method that calls `/me/player/devices`.

## Advanced: Playing Specific URIs

You can also play specific Spotify URIs if you have them:

```typescript
// Play a specific track
await client.startPlayback({ 
  uris: ["spotify:track:6lB7BVBUK2KJDqVPmBiKUr"] 
});

// Play an album from the start
await client.startPlayback({ 
  context_uri: "spotify:album:6pwuKxMUkNg673KETsXPUV" 
});

// Play a playlist
await client.startPlayback({ 
  context_uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M" 
});
```

## API Reference

All playback tools accept an optional `deviceId` parameter to target a specific device. If not provided, the currently active device is used.

### spotify_play_track
- **query** (required): Song and artist name
- **deviceId** (optional): Target device ID

### spotify_pause
- **deviceId** (optional): Device to pause

### spotify_resume
- **deviceId** (optional): Device to resume

### spotify_next
- **deviceId** (optional): Device to skip on

### spotify_previous
- **deviceId** (optional): Device to skip on

### spotify_get_current_playback
No parameters - returns current playback state across all devices

## Comparison: Free vs Premium

| Feature | Free | Premium |
|---------|------|---------|
| Get Top Tracks | ✅ | ✅ |
| Get Top Artists | ✅ | ✅ |
| Recently Played | ✅ | ✅ |
| Play Track | ❌ | ✅ |
| Pause/Resume | ❌ | ✅ |
| Skip Tracks | ❌ | ✅ |
| Current Playback | ❌ | ✅ |

## Security Notes

- Never share your access tokens
- Tokens from the web console expire in 1 hour
- For production apps, implement proper OAuth2 with refresh tokens
- Store tokens securely (not in code or public configs)
