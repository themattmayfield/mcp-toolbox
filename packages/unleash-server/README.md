# Unleash MCP Server

A Model Context Protocol server for managing Unleash feature flags. Control your feature flags across multiple instances and environments without accessing the Unleash web interface.


## Key Features

- ✅ **Multiple Instance Support** - Connect to multiple Unleash instances (prod, staging, dev)
- 🏗️ **Multi-Environment Management** - Handle different environments within each instance
- 🚀 **Complete Feature Flag Operations** - Create, toggle, archive, and monitor feature flags
- 🌍 **Environment Management** - List and understand your deployment environments

## Installation

Install globally via NPM:

```bash
npm install -g @mcp-toolbox/unleash-server
```

## Quick Setup

### Option 1: Interactive Setup (Recommended)
```bash
unleash-server-setup
```

This will guide you through connecting to your Unleash instances with a friendly interactive wizard.

### Option 2: Environment Variables
```bash
# Single instance
export UNLEASH_URL=https://your-unleash.com
export UNLEASH_TOKEN=your-admin-token

# Multiple instances
export UNLEASH_INSTANCES='[
  {
    "name": "production",
    "url": "https://your-unleash.com",
    "token": "your-admin-token",
    "project": "default"
  },
  {
    "name": "staging",
    "url": "https://staging-unleash.com", 
    "token": "staging-token",
    "project": "default"
  }
]'
```

### Option 3: Config File
Create `~/.config/mcp-toolbox/unleash-toolbox.json`:
```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://your-unleash.com",
      "token": "your-admin-token",
      "project": "default"
    }
  ]
}
```

### API Token Requirements

You need **Admin API tokens** (or Service Account tokens) with the following permissions:
- Create feature flags
- Update feature flags
- Archive feature flags
- Read feature flags
- Manage environments

## Usage

### opencode

```json
{
  "mcpServers": {
    "unleash": {
      "type": "local",
      "command": ["unleash-server-mcp-server"],
      "enabled": true
    }
  }
}
```

### Claude Desktop, Cursor, Windsurf, and agents

```json
{
  "mcpServers": {
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

## Interactive Setup Walkthrough

When you run `bun run setup`, you'll be guided through:

1. **🔍 Configuration Detection** - Checks for existing config
2. **📋 Instance Setup** - Add your Unleash instances one by one
3. **🔗 Connection Testing** - Validates URLs and API tokens
4. **📊 Discovery** - Shows available projects and environments  
5. **💾 Save Options** - Choose how to save your configuration
6. **📋 Next Steps** - Get your Claude Desktop config

The setup wizard will:
- ✅ Test connections in real-time
- ✅ Validate API tokens and permissions
- ✅ Discover projects and environments
- ✅ Generate Claude Desktop configuration
- ✅ Provide helpful error messages and recovery options

## Available Tools

### Instance & Environment Management
- **list_instances** - Shows all configured Unleash servers
- **list_environments** - Shows all available environments in an instance

### Feature Flag Management
- **list_features** - Shows all feature flags with their status in a specific environment
- **list_all_features** - Shows feature flags with global status (not environment-specific)
- **get_feature_status** - Gets detailed information about a specific feature flag
- **create_feature** - Creates a new feature flag (automatically disabled in all environments)
- **toggle_feature** - Enables or disables a feature flag in a specific environment
- **archive_feature** - Archives a feature flag when no longer needed

### Strategy Management
- **add_feature_strategy** - Add a strategy to a feature flag in a specific environment
- **update_feature_strategy** - Update a strategy on a feature flag in a specific environment
- **delete_feature_strategy** - Delete a strategy from a feature flag in a specific environment

### Tag Management
- **list_tag_types** - List all available tag types in an instance
- **create_tag_type** - Create a new tag type
- **delete_tag_type** - Delete a tag type
- **add_feature_tag** - Add a tag to a feature flag
- **get_feature_tags** - Get all tags for a feature flag
- **delete_tag** - Delete a tag from all features

## API Reference

This server uses the [Unleash Admin API](https://docs.getunleash.io/reference/api/unleash/features).
