# Weather MCP Server

A Model Context Protocol server that provides weather data using the National Weather Service API.

## Features

- Get weather alerts for any US state
- Get detailed weather forecasts for any location (US only)
- Built with TypeScript and the MCP SDK

## Installation

Install globally via NPM:

```bash
npm install -g @mcp-toolbox/weather-server
```

## Usage

### Claude Desktop

Add to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    }
  }
}
```

### Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    }
  }
}
```

### opencode

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    }
  }
}
```

### Windsurf

Configure in your MCP settings:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    }
  }
}
```

### Other MCP Clients

For any MCP-compatible client, use:
- **Command:** `weather-mcp-server`
- **Arguments:** None required

## Available Tools

### get_alerts
Get weather alerts for a US state.

**Parameters:**
- `state` (string): Two-letter state code (e.g., "CA", "NY")

### get_forecast
Get weather forecast for a location.

**Parameters:**
- `latitude` (number): Latitude of the location (-90 to 90)
- `longitude` (number): Longitude of the location (-180 to 180)

## Development

```bash
# Start in development mode with hot reload
bun run dev

# Type check
bun run typecheck

# Build
bun run build
```