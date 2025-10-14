# OAuth Setup Guide - Get Your Refresh Token

This guide shows you how to get a Spotify refresh token that never expires, so you never have to manually update your access token again.

## Why OAuth with Refresh Token?

| Method | Expiration | Manual Updates? |
|--------|-----------|-----------------|
| Console Token | 1 hour | Yes, every hour 😫 |
| **OAuth Refresh** | **Never** | **No - auto-refreshes!** ✅ |

## Step-by-Step Guide

### Step 1: Create a Spotify App

1. Go to: https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the form:
   - **App name**: "MCP Spotify Server" (or anything you want)
   - **App description**: "Personal Spotify MCP integration"
   - **Redirect URI**: `http://localhost:8888/callback`
   - **Which API/SDKs are you planning to use?**: Check "Web API"
5. Accept terms and click **"Save"**

### Step 2: Get Your Credentials

1. Click on your newly created app
2. Click **"Settings"**
3. You'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "View client secret" and copy it

**Save these somewhere safe!** You'll need them in Step 4.

### Step 3: Get Authorization Code

1. **Build this URL** (replace `YOUR_CLIENT_ID`):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8888/callback&scope=user-read-private%20user-read-email%20user-read-recently-played%20user-top-read%20user-modify-playback-state%20user-read-playback-state
```

2. **Paste it in your browser** and hit Enter
3. **Log in** and click "Agree" to authorize
4. You'll be redirected to `http://localhost:8888/callback?code=...`
5. **Copy the `code` parameter** from the URL (the long string after `code=`)

**Example:**
```
http://localhost:8888/callback?code=AQD3f5g6h7j8k9...
                                    ^^^^^^^^^^^^^
                                    Copy this part
```

**Note:** The authorization code expires in 10 minutes, so complete Step 4 quickly!

### Step 4: Exchange Code for Refresh Token

Run this command in your terminal (replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, and `YOUR_AUTH_CODE`):

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "redirect_uri=http://localhost:8888/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

**Example:**
```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AQD3f5g6h7j8k9..." \
  -d "redirect_uri=http://localhost:8888/callback" \
  -d "client_id=abc123..." \
  -d "client_secret=def456..."
```

You'll get a response like:
```json
{
  "access_token": "BQA...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQC...",  ← THIS IS WHAT YOU NEED!
  "scope": "..."
}
```

**Copy the `refresh_token` value** - this is your golden ticket! 🎫

### Step 5: Configure the MCP Server

Now run the setup:

```bash
cd packages/spotify-server
bun run setup
```

Choose **"OAuth with auto-refresh"** and enter:
- **Client ID** (from Step 2)
- **Client Secret** (from Step 2)
- **Refresh Token** (from Step 4)

That's it! Your tokens will now auto-refresh forever. 🎉

## Quick Setup Script

Want to automate this? Here's a helper script:

```bash
#!/bin/bash
# save as: get-spotify-refresh-token.sh

read -p "Client ID: " CLIENT_ID
read -p "Client Secret: " CLIENT_SECRET

AUTH_URL="https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8888/callback&scope=user-read-private%20user-read-email%20user-read-recently-played%20user-top-read%20user-modify-playback-state%20user-read-playback-state"

echo ""
echo "1. Open this URL in your browser:"
echo "$AUTH_URL"
echo ""
read -p "2. After authorizing, paste the 'code' from the redirect URL: " AUTH_CODE

echo ""
echo "Getting refresh token..."

curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=${AUTH_CODE}" \
  -d "redirect_uri=http://localhost:8888/callback" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}"

echo ""
echo ""
echo "✅ Copy the 'refresh_token' value above!"
```

Usage:
```bash
chmod +x get-spotify-refresh-token.sh
./get-spotify-refresh-token.sh
```

## Required Scopes

The authorization URL includes these scopes:
- `user-read-private` - Read profile
- `user-read-email` - Read email
- `user-read-recently-played` - Recently played tracks
- `user-top-read` - Top tracks/artists
- `user-modify-playback-state` - Control playback
- `user-read-playback-state` - Read playback state

## Troubleshooting

### "Invalid redirect URI"

Make sure you added `http://localhost:8888/callback` **exactly** in your app settings.

### "Invalid client"

Double-check your Client ID and Client Secret are correct.

### "Invalid authorization code"

The authorization code expires in 10 minutes. Get a new one and complete Step 4 faster.

### "Invalid refresh token"

You may have:
1. Changed your Spotify password (invalidates all tokens)
2. Revoked the app's access
3. Made a typo when copying

Solution: Go through the process again to get a new refresh token.

## Security Notes

**Keep these secret:**
- ❌ Don't commit Client Secret to git
- ❌ Don't share your refresh token
- ❌ Don't expose these in public repos

The config file is stored locally and should be kept secure.

## Config File Location

Config files are loaded in this order of precedence:

1. **Local config**: `./spotify-toolbox.json` (in current directory)
2. **User config**: `~/.config/mcp-toolbox/spotify-toolbox.json` (macOS/Linux) or `%USERPROFILE%\.config\mcp-toolbox\spotify-toolbox.json` (Windows)
3. **System config**: `/etc/mcp-toolbox/spotify-toolbox.json` (macOS/Linux)

The setup wizard saves to the user config path (#2).

Example config:
```json
{
  "useEnvToken": false,
  "oauth": {
    "clientId": "your_client_id",
    "clientSecret": "your_client_secret",
    "refreshToken": "your_refresh_token"
  }
}
```

## How Token Refresh Works

1. **First use**: Gets access token using refresh token
2. **Token expires** (after ~1 hour): Automatically refreshes in background
3. **You**: Don't do anything - it just works! ✨

You'll see this message when tokens refresh:
```
🔄 Refreshing Spotify access token...
```

## Alternative: Use a Tool

If the manual process is too complex, use these tools:

### Option 1: spotify-token-swap

```bash
npx spotify-token-swap
```

Guides you through OAuth flow with a local server.

### Option 2: Authorization Code Flow Helper

Some online tools can help:
- https://alecrem.com/spotify-web-api-authorization-code-flow-helper/ (third-party)

**Warning:** Only use trusted tools - they'll see your tokens!

## Need Help?

If you get stuck:
1. Double-check each step carefully
2. Make sure redirect URI is exactly `http://localhost:8888/callback`
3. Complete the auth code exchange within 10 minutes
4. Try the process again from scratch if something fails

Still stuck? Open an issue with:
- Which step you're on
- The error message you're getting
- What you've already tried
