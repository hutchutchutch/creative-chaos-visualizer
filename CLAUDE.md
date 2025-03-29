# Creative Chaos Visualizer - Agent Guidelines

## Commands
- **Build**: `npm run build` or `bun run build`
- **Dev Server**: `npm run dev` or `bun run dev`
- **Lint**: `npm run lint` or `bun run lint`
- **Preview**: `npm run preview` or `bun run preview`

## Code Style Guidelines
- **Naming**: Use PascalCase for components, camelCase for variables/functions
- **Imports**: Group imports: React, third-party, local (components, hooks, utils)
- **Types**: Use TypeScript interfaces/types for all props, state, and function parameters
- **Components**: Prefer functional components with hooks
- **Formatting**: Use consistent indentation (2 spaces) and add trailing commas
- **Error Handling**: Use try/catch with appropriate fallbacks for 3D rendering
- **State Management**: Prefer React hooks (useState, useContext) for state
- **Performance**: Use useCallback/useMemo for expensive calculations and event handlers
- **File Structure**: Keep related functionality in same directory (e.g., game components)
- **Comments**: Document complex 3D calculations and game mechanics

This project uses React Three Fiber (r3f) for 3D visualization with shadcn/ui components.