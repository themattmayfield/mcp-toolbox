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

Add to your MCP client configuration. For Claude Desktop:

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/weather-server/build/index.js"]
    }
  }
}
```

For other MCP clients (OpenCode, Claude Code, Cursor), refer to their documentation for MCP server configuration using the same command and arguments.

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