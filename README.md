# Dillinger Desktop

Focused local Markdown editor with live preview, native file operations, and
Markdown, HTML, and PDF export.

## Requirements

- Node.js 24+
- npm

## Development

Install dependencies and run the web renderer:

```bash
npm install
npm run dev
```

Run the Electron shell with its local Next.js server:

```bash
npm run electron:dev
```

## Packaging

```bash
npm run electron:package       # Current platform
npm run electron:package:win  # Windows NSIS installer
npm run electron:package:mac  # macOS DMG and ZIP
npm run electron:package:linux # Linux AppImage and DEB
```

Artifacts are written to `release/`. Production macOS distribution requires
Apple signing and notarization credentials.

## Features

- Monaco editor with Markdown syntax highlighting
- Live preview with scroll sync
- Native Open, Save, and Save As dialogs
- Local document persistence and auto-save
- Markdown, styled HTML, and PDF export
- Image paste support
- Zen mode and keyboard shortcuts

## Scripts

```bash
npm run build       # Next.js production build
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test:unit   # Vitest tests
npm run test:e2e    # Playwright tests
npm run verify      # Lint, typecheck, unit, and E2E tests
```

Tests live in `tests/`, organized by library, store, hook, component, route,
and end-to-end coverage.

## Tech stack

- Next.js 16
- Electron
- Monaco
- Tailwind CSS
- Zustand
- Lucide

## License

MIT
