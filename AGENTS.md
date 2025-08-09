# AGENTS.md - Development Guidelines

## Build/Lint/Test Commands
- `bun run build` - Build all packages
- `bun run lint` - Check code with Biome linter
- `bun run lint:fix` - Fix linting issues automatically
- `bun run typecheck` - Type check all packages
- `bun run test` - Run tests for all packages
- `bun run dev` - Start development mode for all packages
- `bun run clean` - Clean build artifacts
- Single package: `bun run --filter=package-name test` (replace package-name)

## Code Style Guidelines
- **Formatter**: Biome with tab indentation, double quotes
- **Imports**: Use `.js` extensions for local imports, organize imports automatically
- **Types**: Define interfaces for all public APIs, use Zod schemas for validation
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Error Handling**: Use try/catch blocks, log errors to stderr with `console.error`
- **Exports**: Use named exports, barrel exports in index.ts files
- **File Structure**: Monorepo with packages in `packages/`, shared utilities in `packages/shared`

## Project Context
- TypeScript monorepo using Bun runtime and workspaces
- MCP (Model Context Protocol) server implementations
- Uses @modelcontextprotocol/sdk for server framework
- Shared utilities and types in `packages/shared`