---
title: Unleash Server
description: Manage Unleash feature flags from Claude Desktop
---

The Unleash Server lets you manage feature flags across multiple Unleash instances and environments directly from Claude Desktop.

## Features

- Connect to multiple Unleash instances (prod, staging, dev)
- Create and archive feature flags
- Toggle features on/off in specific environments
- List and filter feature flags
- Manage environments

## Quick Setup

Run the interactive setup wizard:

```bash
cd packages/unleash-server
bun run setup
```

This will guide you through connecting to your Unleash instances and generate the Claude Desktop configuration.

## Available Tools

### create_feature
Create a new feature flag.

**Parameters:**
- `instance` (string): Unleash instance name
- `name` (string): Feature flag name
- `description` (string, optional): Description

### toggle_feature
Enable or disable a feature flag in an environment.

**Parameters:**
- `instance` (string): Unleash instance name
- `name` (string): Feature flag name
- `environment` (string): Environment name
- `enabled` (boolean): Enable or disable

### list_features
List all feature flags with filtering options.

**Parameters:**
- `instance` (string): Unleash instance name
- `project` (string, optional): Project filter