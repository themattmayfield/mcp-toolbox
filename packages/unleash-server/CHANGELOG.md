# @mcp-toolbox/unleash-server

## 2.1.3

### Patch Changes

- 5249327: Fix setup script execution in Node.js

  - Replace Bun-specific import.meta.main with Node.js compatible check
  - This fixes the unleash-server-setup command not running when executed as a binary

## 2.1.2

### Patch Changes

- d6afbaa: Add shebang lines to make binaries executable

  - Add #!/usr/bin/env node to server entry points
  - Fix setup script shebang to use node instead of bun
  - This fixes execution issues when using the servers as CLI commands

## 2.1.1

### Patch Changes

- 3ddee63: Fix workspace dependencies and publish shared package

  - Make shared package public so it can be published
  - Replace workspace:\* dependencies with actual version numbers
  - This fixes npm install errors for published packages

- Updated dependencies [3ddee63]
  - @mcp-toolbox/shared@2.1.1

## 2.1.0

### Minor Changes

- d121c21: Updated installation guides

### Patch Changes

- Updated dependencies [d121c21]
  - @mcp-toolbox/shared@2.1.0

## 2.0.0

### Major Changes

- b113a99: Created defalt boilerplate using weather mcp and added unleash mcp

### Patch Changes

- Updated dependencies [b113a99]
  - @mcp-toolbox/shared@2.0.0
