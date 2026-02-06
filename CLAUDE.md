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

### Key Components

| Component | Description |
|-----------|-------------|
| `ShoeGrid` | Main grid with search/filter. Desktop: sidebar layout. Mobile: bottom sheet filter |
| `ShoeCard` | Card with image loading animation, retry logic, React.memo optimization |
| `ShoeModal` | Full details with image zoom, keyboard navigation (←→), close animation |
| `Header` | Fixed header with logo and external link |

### Responsive Layouts

**Desktop (≥1024px)**
```
┌─────────┬──────────────────────┐
│ Sidebar │ Search + Sort        │
│ Filter  ├──────────────────────┤
│         │ Shoe Grid            │
└─────────┴──────────────────────┘
```

**Mobile (<1024px)**
```
┌────────────────────────┐
│ Search + Filter + Sort │ (sticky)
├────────────────────────┤
│ Shoe Grid              │
└────────────────────────┘
Filter → Bottom Sheet (85vh max)
```

### Utilities

- `src/utils/displayNames.ts` - Shortens long discipline names
  - "Road Races (including Track Race Walking Events)" → "Road Races"
  - "Cross Country (including Mountain and Trail Running)" → "Cross Country"

### Brand Priority

Nike, Adidas, Puma, Asics are always displayed first (in that order).

### Status Colors

| D-day | Color |
|-------|-------|
| Expired (≤0) | Red |
| ≤30 days | Amber |
| ≤90 days | Sky |
| >90 days | Emerald |

### Image URLs
Format: `https://certcheck.worldathletics.org/OpenDocument/{imageDocumentuuid}`

## Design System

### Design Tokens (src/styles/tokens.ts)

All colors and styles are defined in tokens.ts:
- `BG` - Background colors (page, surface, interactive, overlay)
- `BORDER` - Border colors (subtle: white/[0.06], default: white/10)
- `TEXT` - Text colors (primary → disabled, 5 levels)
- `STATUS` - D-day status colors (expired, urgent, warning, safe, unknown)
- `FILTER` - Filter category colors (brand=indigo, discipline=sky, type=violet)
- `BUTTON`, `BADGE`, `CHIP` - Component-specific styles

**Important:** Tailwind JIT doesn't support dynamic classes like `bg-${color}-500`.
Always use full class names from tokens.ts.

### CSS Variables (globals.css)
- `--background`: #000000
- `--accent-indigo`: #6366f1 (indigo)
- `--accent-violet`: #8b5cf6 (violet)
- `--card-bg`: #0a0a0a
- Glass effect: `backdrop-filter: blur(20px)`

### Key CSS Classes
- `.card-new` - Card style with indigo glow on hover
- `.glass` - Glassmorphism effect
- `.skeleton` - Loading shimmer animation
- `.break-words` - Word-level text wrapping
- `.scrollbar-thin` - Thin scrollbar for sidebars
- `.modal-zoom-enter` / `.modal-zoom-exit` - Modal open/close animations
- `.modal-stagger-1` to `.modal-stagger-6` - Staggered entrance for modal content
- `.glow-orb`, `.glow-orb-1/2/3` - Hero section background orbs
- `.animate-fade-in/out/up` - Fade animations
- `.stagger-bounce` - Card grid sequential bounce entrance animation
- `.btn-haptic` - Button touch feedback (scale on press)
- `.hero-badge` / `.hero-description` - Blur-to-sharp reveal entrance animations
- `.hero-beam` - Activation beam (center→outward light line on page load)
- `.animate-slide-out-bottom` - Bottom sheet exit animation

### Accessibility
- Focus-visible rings on all interactive elements
- 44px minimum touch targets
- `prefers-reduced-motion` support
- ARIA labels on buttons and modals
- Keyboard navigation in modal (←→ arrows, ESC to close)
- iOS Safe Area via `viewport-fit: cover` + `env(safe-area-inset-bottom)`

## Performance Optimizations

- **React.memo**: ShoeCard uses custom comparison to prevent unnecessary re-renders
- **Dynamic Import**: ShoeModal is lazy-loaded with Suspense for code splitting
- **Image Loading**: Native lazy loading with error retry logic (1 retry)
- **useCallback**: All event handlers memoized to prevent child re-renders

## UX Features

### Modal Navigation
- **Arrow keys**: Navigate between shoes (←→)
- **Image zoom**: Click image to view full-size, click again or ESC to close
- **Keyboard hints**: Displayed at bottom of modal

### Image Loading
- Skeleton with brand initials while loading
- Blur-to-sharp transition on load
- Automatic retry on load failure

### Animations
- Card entrance: Bouncy stagger animation
- Card hover: Lift + indigo glow effect
- Hero: Activation beam + blur-to-sharp text reveal
- Modal: Zoom-in/out with backdrop blur
- Buttons: Haptic feedback feel

## Refactoring Notes

### Magic Numbers Reference
- Layout: `max-w-[1400px]` container, `min-h-[44px]` touch target (WCAG 2.5.5)
- Status thresholds: 30 days (urgent), 90 days (warning) - defined in `utils/date.ts`
- Progress bar: 180 days max - defined in `utils/progress.ts`

### tokens.ts ↔ globals.css Sync
When adding animation classes to tokens.ts, ensure corresponding @keyframes exist in globals.css.

## Deployment

Deployed on Vercel. Push to `main` branch triggers automatic deployment.
