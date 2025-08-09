---
title: Weather Server
description: The Weather Server provides weather data for US locations using the National Weather Service API. Get weather alerts and detailed forecasts without requiring any API keys.
---

**Name:** Weather MCP Server

## Description

The Weather Server provides weather data for US locations using the National Weather Service API. Get weather alerts and detailed forecasts without requiring any API keys.

## Key Concepts

**US Locations Only**: This server uses the National Weather Service API, which only provides data for US locations.

**No API Key Required**: The NWS API is free and doesn't require authentication, making setup simple and reliable.

## Quick Setup

### 1. Installation

Install globally via NPM:

```bash
npm install -g @mcp-toolbox/weather-server
```

### 2. Add to Your MCP Client

#### Claude Desktop

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
**Purpose**: Get weather alerts for a US state  
**When to use**: Check for severe weather warnings, watches, or advisories

**Parameters:**
- `state` (required): Two-letter state code (e.g., "CA", "NY")

```
get_alerts state="CA"
get_alerts state="TX"
```

**Example usage:**
> "Are there any weather alerts for California?"

### get_forecast
**Purpose**: Get detailed weather forecast for a specific location  
**When to use**: Get current conditions and multi-day forecasts for any US location

**Parameters:**
- `latitude` (required): Latitude of the location (-90 to 90)
- `longitude` (required): Longitude of the location (-180 to 180)

```
get_forecast latitude=37.7749 longitude=-122.4194
get_forecast latitude=40.7128 longitude=-74.0060
```

**Example usage:**
> "What's the weather forecast for San Francisco?" (Claude will look up coordinates)