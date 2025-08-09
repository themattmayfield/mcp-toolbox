---
"@mcp-toolbox/shared": patch
"@mcp-toolbox/weather-server": patch
"@mcp-toolbox/unleash-server": patch
---

Fix workspace dependencies and publish shared package

- Make shared package public so it can be published
- Replace workspace:* dependencies with actual version numbers
- This fixes npm install errors for published packages