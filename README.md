# devtoolsforme

`devtoolsforme` is a browser-first utility site for everyday developer work.

It focuses on fast, client-side tools for data formatting, encoding, inspection, reference lookups, and embedded/firmware workflows.

## Current scope

The app now includes:

- General utilities: UUID, Base64, calculator, hex/base conversion, JSON formatting/diffing, regex, text diff, URL tools, timestamps
- Reference/design helpers: HTTP status lookup, MIME lookup, color conversion, color contrast
- Embedded tools: bitmask/register helpers, CRC, endianness, memory viewer, UART/timer/PLL/DMA calculators, Intel HEX and S-record inspectors, protocol helpers, fixed-point and float inspection, and more

A few notable tools:

- UUID generator with `v1`, `v3`, `v4`, `v5`, and `v7`
- Intel HEX inspector
- S-record inspector
- Register field builder
- PLL calculator
- DMA throughput calculator

## Stack

- `Next.js 16`
- `TypeScript`
- `Tailwind CSS`
- `Playwright`
- `Vitest`

## Local development

Environment variables:

- `NEXT_PUBLIC_GA_ID` for consent-gated Google Analytics
- `NEXT_PUBLIC_HEROTOFU_FORM_ACTION` or `HEROTOFU_FORM_ACTION` for the homepage contact form POST target

The same HeroTofu-backed form is used on the homepage contact section and the dedicated `/contact` page.
If you want a custom post-submit landing page in HeroTofu, point the success redirect to `/contact/thanks`.

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Default app URL:

```text
http://localhost:3000
```

## Testing

Unit tests:

```bash
npm run test:unit
```

End-to-end tests:

```bash
npm run test:e2e
```

Playwright uses a dedicated local server on `http://localhost:3110` during `npm run test:e2e`.

## Validation

Type-check and Next route generation:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

## Deployment

The project uses static export output for Netlify.

Build locally:

```bash
npm run build
```

Netlify should publish the generated `out` directory.

## Project notes

- The site is designed to work without a backend for the current tool set
- Google Analytics is consent-gated
- Homepage and tool pages are intentionally compacted for quick developer access
- Embedded tooling is a major product area, not a secondary add-on

## Architecture review snapshot

- `app/` owns route composition and page-level metadata
- `components/` owns reusable UI and tool implementations
- `lib/` owns shared metadata helpers, catalogs, and pure utility logic
- Tool routes should stay thin and delegate to shared helpers instead of duplicating page shell wiring

## Iterative refactor plan

- Keep route modules lightweight and consistent by centralizing repeated tool-page boilerplate
- Continue moving pure parsing/calculation logic into `lib/` so it can be unit-tested without UI coupling
- Expand focused unit and smoke coverage whenever a shared helper or cross-tool behavior changes
- Prefer small, validated refactors so each step can ship with `npm run lint`, `npm run test:unit`, `npm run build`, and `npm run test:e2e`
