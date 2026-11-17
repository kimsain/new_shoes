# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js website that displays World Athletics development shoes (prototypes awaiting full approval).
- **Language**: Korean (ko)
- **GitHub**: https://github.com/kimsain/new_shoes

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server at http://localhost:3000
npm run build   # Production build
npm run lint    # Run ESLint
npm test        # Vitest (pure logic and state machines in src/__tests__)
npm run test:coverage  # Fails below 90% line coverage
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Data Fetching**: Server-side with ISR (revalidates every hour)

### Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   └── filters/   # Filter-related components
├── constants/     # App constants (URLs, brands)
├── hooks/         # Custom React hooks (useFilters, useSearch)
├── lib/           # API and data fetching
├── styles/        # Design tokens (tokens.ts)
├── types/         # TypeScript interfaces
└── utils/         # Utility functions (date, displayNames, progress)
```

### Data Flow
1. `page.tsx` fetches HTML from World Athletics FullList page
2. Parses embedded JSON from `litProductsDataRaw` variable
3. Filters for development shoes (`isDevelopmentShoe === true` OR `status === 'APPROVED_UNTIL'`)
4. Passes data to client components for display
5. On failure `fetchDevelopmentShoes` throws, so ISR keeps serving the last good page. Only during `next build` it returns `[]` (empty state) so a source outage never blocks a deploy

### Key Components

| Component | Description |
|-----------|-------------|
| `HeroSection` | Two-line headline with live count, stats (CountUp), tilted 3D "prototype wall" of the newest shoe photos |
| `ShoeGrid` | Catalog: sticky toolbar (search, status segment, sort, filter button), brand rail, active filter chips, card grid, opens `ShoeModal` / `FilterPanel` |
| `ShoeCard` | Photo plate (same photo blurred behind a contained photo), D-day, remaining-window bar, cursor glow. `React.memo` with a stable `onOpen(id)` |
| `ShoeModal` | Detail: big photo (shared-element morph from the card), countdown, certification timeline, details, ←→/swipe navigation, zoom, focus trap |
| `FilterPanel` | One component: right drawer on desktop, bottom sheet on mobile (drag to dismiss). Sort lives here on mobile |
| `BrandRail` / `StatusSegment` / `SortMenu` / `SearchBar` | Toolbar pieces. Search focuses with `/` |
| `Header` / `Footer` / `ScrollToTop` | Fixed header (hides on scroll down on mobile), footer wordmark, back-to-top with scroll progress ring (desktop only) |

### Responsive Layouts

**Desktop (≥1024px)**
```
┌──────────────────────────────────────────┐
│ Search │ Status segment │ Sort │ Filter  │ (sticky)
├──────────────────────────────────────────┤
│ Brand rail (scrolls horizontally)        │
├──────────────────────────────────────────┤
│ Grid: 3 cols (lg), 4 cols (xl)           │
└──────────────────────────────────────────┘
Filter → right drawer (420px)
```

**Mobile (<1024px)**
```
┌────────────────────────┐
│ Search │ Sort │ Filter │ (sticky, moves up when the header hides)
├────────────────────────┤
│ Brand rail             │
├────────────────────────┤
│ Grid: 2 cols           │
└────────────────────────┘
Filter → bottom sheet (88svh max), Detail → full screen
```

### Utilities

- `src/utils/displayNames.ts` - Shortens long discipline names
  - "Road Races (including Track Race Walking Events)" → "Road Races"
  - "Cross Country (including Mountain and Trail Running)" → "Cross Country"
- `src/utils/progress.ts` - Elapsed / remaining ratio of each shoe's own certification window (day-based so SSR and client match)
- `src/lib/motion.ts` - `runViewTransition(kind, update)`, `observeReveal(el)`, reduced-motion check
- `src/lib/detailMachine.ts` / `src/lib/sheetMachine.ts` - Pure reducers for the detail modal (closed / open / exiting) and the filter sheet (entering / dragging / resting / closing). Events not allowed in the current phase are ignored
- `src/hooks/useToday.ts` - UTC day used for D-day math: the server render time during hydration, then the browser's day

### Brand Priority

Nike, Adidas, Puma, Asics are always displayed first (in that order) in the brand rail and filter panel.

### Status Colors

| D-day | Card number | Bar / chip |
|-------|-------------|------------|
| Expired (≤0) | Gray | Gray |
| ≤30 days | Hot `#FF6A3D` | Hot |
| ≤90 days | Warn `#FFB224` | Warn |
| >90 days | White | Volt `#D4FA3C` |

### Image URLs
Format: `https://certcheck.worldathletics.org/OpenDocument/{imageDocumentuuid}`

Images go through Next image optimization (originals are 1–4MB). `minimumCacheTTL` is 31 days because a document UUID never changes. Card and detail use the same `CARD_IMAGE_SIZES` so the detail can paint the already-downloaded photo on the first frame.

## Design System

Reference: dark neutral ramp and Pretendard type from Chzzk (getdesign.kr), "one object on dark, one accent" from ORYZO (styles.refero.design). Astryx was reviewed but not adopted (StyleX-based; this project is Tailwind v4).

### Design Tokens

Defined as CSS variables in `@theme` (`src/app/globals.css`) and used as Tailwind utilities:
- Surfaces: `bg-canvas` #0A0B0C, `bg-surface` #111214, `bg-raised` #17191B, `bg-control` #1D1F22
- Lines: `border-line` (white 7%), `border-line-strong` (white 13%)
- Text: `text-fg`, `text-fg-2`, `text-fg-3`, `text-fg-4`
- Accent: `bg-volt` / `text-volt` #D4FA3C with `text-volt-ink`; status `warn`, `hot`
- Radius: `rounded-card` 20px
- Easing: `ease-out`, `ease-in`, `ease-in-out`, `ease-spring`, `ease-emphasized`

`src/styles/tokens.ts` keeps only runtime class maps (`STATUS`) and motion durations (`MOTION`).

**Important:** Tailwind JIT doesn't support dynamic classes like `bg-${color}-500`. Always use full class names.

Font: Pretendard Variable from jsDelivr (dynamic subset) for everything. No serif.

### Key CSS Classes (globals.css)
- `.anim-rise` - Title lines: 12px rise + fade, 400ms, `--i` × 80ms stagger
- `.wall-*` - Hero photo wall (3D plane, marquee rows, edge mask, entrance)
- `.hero-scroll-copy` / `.hero-scroll-wall` - Scroll-driven exit (only where `animation-timeline: view()` is supported)
- `.reveal` + `data-revealed` - Scroll reveal (hidden only when `html.js` is set)
- `.shoe-card*`, `.bar-fill` - Card hover lift, cursor glow (transform only), remaining bar grow
- `.segment-indicator` - Sliding status indicator (`--index`)
- `.popup-in/out`, `.overlay-in/out`, `.panel-in/out`, `.menu-in`, `.nav-from-left/right` - Overlay motion
- `.check-path` - Checkbox stroke draw
- `.countup-pending` - Hides CountUp numbers until hydration (falls back after 1.5s)
- `.skeleton`, `.spinner` (800ms), `.progress-ring`

**Text wrapping rule:** Never use `hyphens: auto` or `break-all` on natural language text. Use `break-words` (keep-all + overflow-wrap).

### Accessibility
- Volt focus-visible outline on all interactive elements; card focus shows on the whole card
- 44px minimum touch targets
- `prefers-reduced-motion`: movement and scale removed, short fades only (spinner stays)
- Dialogs: `aria-modal`, focus trap, focus returns to the card
- Keyboard: `/` search, ←→ and ESC in detail, arrow keys in sort menu
- iOS Safe Area via `viewport-fit: cover` + `env(safe-area-inset-*)`

## Performance Optimizations

- **React.memo**: ShoeCard re-renders only when `today`, `isNew`, `lifted` or `onOpen` change. `onOpen` is stable and takes the shoe id. `today` comes from `useToday(renderedAt)` so D-day hydrates with the server render time, then switches to the browser's day
- **Image optimization**: WebP at card size instead of multi-MB originals; ambient backdrop reuses the same URL
- **Animations**: only `transform` and `opacity` move. No animated `filter: blur`
- **Mobile (measured with 4x CPU throttle)**: the scroll progress ring repainted the page every scroll frame, so it runs only on fine pointers. Header, toolbar and the detail overlay drop `backdrop-blur` below `lg` and use a more opaque background. Filter View Transitions on touch devices capture only the cards in view (`data-vt-move`), which halves the tap-to-animation delay

## UX Features

### Motion
- Hero: line-by-line title, count-up stats, drifting photo wall (pauses on hover), scroll-driven exit
- Cards: scroll reveal with position-ordered stagger, hover lift + glow
- Filter/sort changes from the toolbar or rail: View Transitions move cards to their new spots (`html[data-vt="filter"]`). The header and toolbar get their own `view-transition-name` only during this kind; a permanent name would draw them above the detail during open/close
- Card → detail: the card photo flies to the detail photo (`view-transition-name: shoe-media`), and back on close when the card is on screen
- Fallback without View Transitions: CSS popup / fade

**Timing:** popup 200ms in / 150ms out, sheet and drawer 300 / 250ms, title lines 400ms with 80ms stagger, checkbox 200ms, spinner 800ms per turn, card morph 450 / 320ms. Entrances use `ease-out`, exits `ease-in` and are shorter, large moves use `ease-emphasized` `cubic-bezier(0.2, 0, 0, 1)`.

### Typography Rules
- Always set explicit `text-*` size on every text element — never rely on inherited font size
- Use `line-clamp-*` + `break-words` for multi-line truncation (e.g., product names)
- Use `truncate` with `title` attribute for single-line overflow
- `tabular-nums` on all numeric counts for consistent alignment

## Refactoring Notes

### Magic Numbers Reference
- Layout: `max-w-[1400px]` container, `min-h-[44px]` touch target (WCAG 2.5.5), header 64px
- Status thresholds: 30 days (urgent), 90 days (warning) - defined in `utils/date.ts`
- NEW badge: certified within `NEW_WINDOW_DAYS` (30)
- Hero wall: `HERO_WALL_COUNT` (18) newest shoes in 3 rows

### Lint
`npm run lint` reports 0 problems. Keep it that way.

## Deployment

Deployed on Vercel. Push to `main` branch triggers automatic deployment.
