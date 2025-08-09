---
title: Weather Server
description: Get weather information using the National Weather Service API
---

The Weather Server provides weather data for US locations using the National Weather Service API.

## Features

- Get weather alerts for any US state
- Get detailed weather forecasts for any location (US only)
- No API key required (uses free NWS API)

## Installation

Install globally via NPM:

```bash
npm install -g @mcp-toolbox/weather-server
```

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

**Example usage:**
> "Are there any weather alerts for California?"

### get_forecast

Get weather forecast for a location.

**Parameters:**
- `latitude` (number): Latitude of the location (-90 to 90)
- `longitude` (number): Longitude of the location (-180 to 180)

**Example usage:**
> "What's the weather forecast for San Francisco?" (Claude will look up coordinates)