# Spotify Playback Troubleshooting

## "No active device found" Error

This is the most common issue. Here's why it happens and how to fix it:

### Why This Happens

Spotify's API requires a device to be **actively playing or paused**, not just open. Simply having the Spotify app open is not enough.

### Solution

**Option 1: Let Claude Open Spotify (Easiest!)**
Ask Claude: "Open Spotify for me" or use:
```
spotify_open_app
```

This will:
- Automatically open Spotify on your device (macOS/Windows/Linux)
- Wait for it to launch
- Then you just need to play a song once

**Option 2: Quick Manual Fix**
1. Open Spotify (app or web player: https://open.spotify.com)
2. **Play any song** (even for 1 second)
3. Now try your command again

**Option 3: Check Your Devices**

Ask Claude: "Check my Spotify devices" or use the tool:
```
spotify_get_devices
```

This will show you:
- All available devices
- Which device is active (✅)
- Device IDs, types, and volume levels

### Device States Explained

- **✅ Active** - This device is currently playing or was recently used. Commands will work.
- **⚪ Inactive** - Device is available but not active. Start playing something on it first.
- **Not Listed** - Device isn't registered. Open Spotify and play something.

### Common Scenarios

#### Scenario 1: Spotify is open but never played anything
```
Status: No devices found
Fix: Play any song once
```

#### Scenario 2: Spotify was playing but paused for too long
```
Status: Inactive device
Fix: Resume playback or play a new song
```

#### Scenario 3: Multiple devices but wrong one is active
```
Status: Wrong device active
Fix: Play something on the device you want to use
```

## Token Scope Issues

### Error: "Insufficient client scope"

Your token doesn't have the required permissions.

**Solution:**
1. Go to: https://developer.spotify.com/console/put-play/
2. Click "GET TOKEN"
3. Select ALL these scopes:
   - ✅ user-read-recently-played
   - ✅ user-top-read
   - ✅ user-modify-playback-state (REQUIRED for playback)
   - ✅ user-read-playback-state (REQUIRED for playback)
4. Copy the new token
5. Update your `SPOTIFY_ACCESS_TOKEN` environment variable

## Premium Required

### Error: "Premium required"

Spotify playback control only works with Premium accounts.

**What Works Without Premium:**
- ✅ Get top tracks
- ✅ Get top artists
- ✅ Recently played
- ❌ Play tracks
- ❌ Pause/resume
- ❌ Skip tracks

**Solution:** Upgrade at https://www.spotify.com/premium/

## Token Expired

### Error: "401 Unauthorized" or "Invalid access token"

Tokens from the Spotify web console expire after 1 hour.

**Solution:**
1. Get a new token: https://developer.spotify.com/console/put-play/
2. Update `SPOTIFY_ACCESS_TOKEN`
3. Or implement OAuth2 with refresh tokens for production use

## Testing Your Setup

### Step 1: Test Authentication
```
Ask Claude: "Show my Spotify profile"
or
spotify_get_current_user
```

Should show your name and email. If this fails, your token is invalid.

### Step 2: Test Devices
```
Ask Claude: "Check my Spotify devices"
or
spotify_get_devices
```

Should list at least one device. If empty, open Spotify and play something.

### Step 3: Test Playback
```
Ask Claude: "Play bohemian rhapsody"
or
spotify_play_track({ query: "bohemian rhapsody queen" })
```

Should start playing. If not, check the error message.

## Device Selection Tips

### Making a Device Active

Different ways to activate a device:

**Desktop App:**
1. Open Spotify desktop app
2. Play any song
3. Device is now active ✅

**Mobile App:**
1. Open Spotify on your phone
2. Tap any song
3. Device is now active ✅

**Web Player:**
1. Go to https://open.spotify.com
2. Click play on any song
3. Device is now active ✅

### Switching Devices

If you want to control a specific device:

1. Check available devices: `spotify_get_devices`
2. Note the device ID you want
3. Use deviceId parameter in commands:
   ```
   spotify_play_track({ 
     query: "numb giveon",
     deviceId: "abc123..."
   })
   ```

## Web Player Issues

### Web Player Not Showing Up

The Spotify web player sometimes doesn't register as a device immediately.

**Fix:**
1. Go to https://open.spotify.com
2. Click "Enable hardware acceleration" if prompted
3. Play a full song (not just a preview)
4. Refresh if needed

### Browser Permissions

Make sure your browser allows:
- Audio playback
- Media controls
- Background playback (Chrome/Edge)

## Network & Firewall Issues

If devices show up but commands fail:

1. **Check your network** - Spotify API requires internet
2. **Disable VPN temporarily** - Some VPNs block Spotify API
3. **Check firewall** - Ensure Spotify can connect to api.spotify.com
4. **Restart Spotify** - Sometimes helps reset connections

## Advanced Debugging

### Check Raw Playback State

```typescript
// This will show detailed device and playback info
spotify_get_current_playback
```

Returns:
- Current track
- Progress/duration
- Device name and ID
- Volume level
- Play/pause state

### Manual Device Refresh

If a device disappears:
1. Close Spotify completely
2. Reopen Spotify
3. Play a song
4. Check devices again

## Still Not Working?

### Checklist
- [ ] Spotify Premium account?
- [ ] Token has playback scopes?
- [ ] Token not expired? (refresh if >1 hour old)
- [ ] Spotify is open on a device?
- [ ] You've played a song recently on that device?
- [ ] Internet connection working?
- [ ] Firewall not blocking Spotify?

### Get Help

If none of this works:

1. **Check Spotify Status**: https://status.spotify.com/
2. **Verify Token Scopes**: Use spotify_get_devices - if this fails, it's a token scope issue
3. **Try Different Device**: Test with web player vs desktop app
4. **Check API Response**: Look at the exact error message

### Report Issues

If you believe this is a bug:
1. Share the error message
2. Output from `spotify_get_devices`
3. Token scopes you selected
4. Device type (desktop/mobile/web)
