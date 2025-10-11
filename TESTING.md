# Testing MCP Servers Locally

This guide explains how to test MCP servers in this monorepo before publishing them to npm.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Testing Methods](#testing-methods)
  - [1. MCP Inspector (Recommended)](#1-mcp-inspector-recommended)
  - [2. Direct Command Line Testing](#2-direct-command-line-testing)
  - [3. Claude Desktop Integration](#3-claude-desktop-integration)
- [Package-Specific Testing](#package-specific-testing)
  - [Unleash Server](#unleash-server)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Build the package** you want to test:
   ```bash
   # Build all packages
   bun run build
   
   # Or build a specific package
   cd packages/unleash-server
   bun run build
   ```

2. **Set up configuration** (if required):
   - Some servers require API keys or configuration
   - Run setup scripts if available (e.g., `bun run setup`)

## Testing Methods

### 1. MCP Inspector (Recommended)

The MCP Inspector is the official debugging tool from Anthropic. It provides a web UI to test your MCP server interactively.

#### Installation & Usage

```bash
# Run inspector with npx (no installation needed)
npx @modelcontextprotocol/inspector <path-to-built-server>

# Example: Test unleash-server
npx @modelcontextprotocol/inspector packages/unleash-server/build/index.js

```

#### Features

- ✅ Interactive web UI (opens in browser automatically)
- ✅ See all available tools and their schemas
- ✅ Test tool calls with different parameters
- ✅ View request/response logs in real-time
- ✅ Debug without Claude Desktop
- ✅ Test environment variables and configuration

#### With Environment Variables

```bash
# Pass environment variables to the server
UNLEASH_URL=https://your-unleash.com \
UNLEASH_TOKEN=your-token \
npx @modelcontextprotocol/inspector packages/unleash-server/build/index.js
```

### 2. Direct Command Line Testing

Run the server directly to test it responds correctly to stdio communication.

```bash
cd packages/unleash-server

# Build first
bun run build

# Run the server (waits for stdio input)
bun run start

# Or run in dev mode with auto-reload
bun run dev
```

The server will start and wait for JSON-RPC messages on stdin. This is useful for:
- Testing server startup
- Checking configuration loading
- Verifying error messages

### 3. Claude Desktop Integration

Test your server with the actual Claude Desktop application.

#### Configuration Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration Format

```json
{
  "mcpServers": {
    "unleash-dev": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-toolbox/packages/unleash-server/build/index.js"
      ],
      "env": {
        "UNLEASH_URL": "https://your-unleash.com",
        "UNLEASH_TOKEN": "your-admin-token"
      }
    }
  }
}
```

#### Using Bun Instead of Node

```json
{
  "mcpServers": {
    "unleash-dev": {
      "command": "bun",
      "args": [
        "/absolute/path/to/mcp-toolbox/packages/unleash-server/build/index.js"
      ],
      "env": {
        "UNLEASH_URL": "https://your-unleash.com",
        "UNLEASH_TOKEN": "your-admin-token"
      }
    }
  }
}
```

#### Steps

1. **Update config file** with your local paths
2. **Restart Claude Desktop** completely
3. **Test tools** in a conversation:
   ```
   Can you list my Unleash instances?
   ```

## Package-Specific Testing

### Unleash Server

#### Setup Configuration

```bash
cd packages/unleash-server
bun run setup
```

This interactive setup will:
- Test connection to your Unleash instance
- Configure multiple instances if needed
- Save configuration to `~/.config/mcp-toolbox/unleash-toolbox.json`

#### Test with Inspector

```bash
# After running setup
npx @modelcontextprotocol/inspector packages/unleash-server/build/index.js
```

#### Test Available Tools

In the inspector, try these tools:
- `list_instances` - See configured instances
- `list_features` - List feature flags
- `create_feature` - Create a test feature
- `toggle_feature` - Enable/disable features
- `list_environments` - View environments

#### Environment Variables

If not using the config file:

```bash
UNLEASH_URL=https://your-unleash.com \
UNLEASH_TOKEN=your-admin-token \
UNLEASH_PROJECT=default \
npx @modelcontextprotocol/inspector packages/unleash-server/build/index.js
```


## Troubleshooting

### Server Won't Start

**Check build output:**
```bash
cd packages/<package-name>
bun run build
```

**Check for errors:**
```bash
node packages/<package-name>/build/index.js
# Should wait for input, not crash immediately
```

### Configuration Not Found

**Unleash Server:**
- Run `bun run setup` in the package directory
- Or set environment variables (see above)
- Check config file location: `~/.config/mcp-toolbox/unleash-toolbox.json`

### Tools Not Appearing in Claude Desktop

1. **Check config syntax** - JSON must be valid
2. **Use absolute paths** - Relative paths may not work
3. **Restart Claude Desktop** - Quit completely and reopen
4. **Check logs** - Look for errors in Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
   - Linux: `~/.config/Claude/logs/`

### Inspector Not Opening

**Check if already running:**
```bash
# Kill existing inspector processes
pkill -f "inspector"
```

**Try different port:**
```bash
PORT=3001 npx @modelcontextprotocol/inspector <path>
```

### Environment Variables Not Working

**In inspector, use shell:**
```bash
UNLEASH_URL=https://example.com npx @modelcontextprotocol/inspector ...
```

**In Claude Desktop, use env object:**
```json
{
  "env": {
    "UNLEASH_URL": "https://example.com"
  }
}
```

## Best Practices

1. **Start with Inspector** - Easiest way to test tools interactively
2. **Test incrementally** - Test each tool individually before moving to Claude Desktop
3. **Use dev mode** - Run `bun run dev` for auto-reload during development
4. **Check logs** - Always check console output for errors
5. **Test error cases** - Try invalid inputs to ensure proper error handling
6. **Use setup scripts** - Run provided setup scripts for proper configuration

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Claude Desktop Setup](https://claude.ai/desktop)

## Getting Help

If you encounter issues:

1. Check the package's README for specific instructions
2. Review error messages in console/logs
3. Verify configuration and environment variables
4. Test with MCP Inspector first to isolate issues
5. Open an issue in the repository with:
   - Package name and version
   - Error messages
   - Steps to reproduce
