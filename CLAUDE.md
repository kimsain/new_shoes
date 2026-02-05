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

### Data Flow
1. `page.tsx` fetches HTML from World Athletics FullList page
2. Parses embedded JSON from `litProductsDataRaw` variable
3. Filters for development shoes (`isDevelopmentShoe === true` OR `status === 'APPROVED_UNTIL'`)
4. Passes data to client components for display

### Key Components

| Component | Description |
|-----------|-------------|
| `ShoeGrid` | Main grid with search/filter. Desktop: sidebar layout. Mobile: bottom sheet filter |
| `ShoeCard` | Card showing shoe image, name, D-day status, disciplines |
| `ShoeModal` | Full details with large image, dates, all disciplines |
| `Header` | Fixed header with logo, sync status badge, external link |

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

### CSS Variables (globals.css)
- `--background`: #0a0a0a
- `--accent`: #10b981 (emerald)
- `--card-bg`: #131313
- Glass effect: `backdrop-filter: blur(20px)`

### Key CSS Classes
- `.card` - Card with hover elevation
- `.glass` - Glassmorphism effect
- `.skeleton` - Loading shimmer animation
- `.break-words` - Word-level text wrapping
- `.scrollbar-thin` - Thin scrollbar for sidebars

### Accessibility
- Focus-visible rings on all interactive elements
- 44px minimum touch targets
- `prefers-reduced-motion` support
- ARIA labels on buttons and modals

## Deployment

Deployed on Vercel. Push to `main` branch triggers automatic deployment.
