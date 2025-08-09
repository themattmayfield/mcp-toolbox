---
"@mcp-toolbox/weather-server": patch
"@mcp-toolbox/unleash-server": patch
---

Add shebang lines to make binaries executable

- Add #!/usr/bin/env node to server entry points
- Fix setup script shebang to use node instead of bun
- This fixes execution issues when using the servers as CLI commands