# Weather MCP Server

A Model Context Protocol server that provides weather data using the National Weather Service API.

## Features

- Get weather alerts for any US state
- Get detailed weather forecasts for any location (US only)
- Built with TypeScript and the MCP SDK

## Installation

```bash
bun install
bun run build
```

## Usage

### As a standalone server
```bash
bun run start
```

### In Claude Desktop
Add to your `claude_desktop_config.json`:

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