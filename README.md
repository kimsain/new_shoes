<div align="center">

# DevShoes

**The Future of Running Shoes**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel)](https://vercel.com/)

Track development shoes (prototypes) awaiting World Athletics approval in real-time.

[Live Demo](https://new-shoes.vercel.app) · [Report Bug](https://github.com/kimsain/new_shoes/issues) · [Request Feature](https://github.com/kimsain/new_shoes/issues)

</div>

---

## Design

Inspired by **Linear** and **Vercel** - featuring a pure black background, indigo-violet gradient accents, and glow effects.

### Visual Features
- **Glow Orbs** - Floating indigo/violet/cyan orbs in hero section
- **Gradient Accents** - Indigo → Violet gradient throughout
- **Card Glow** - Hover effects with indigo glow and lift animation
- **Progress Bars** - Visual D-day countdown with status colors
- **Stagger Animations** - Smooth entrance animations for content

## Features

### Core
- **Real-time Sync** - Auto-refresh from World Athletics every hour (ISR)
- **Smart Filtering** - Filter by brand, discipline, type, and status
- **D-Day System** - Color-coded expiration countdown with progress bar
- **Responsive Layout** - Desktop sidebar / Mobile bottom sheet

### UX
- **Keyboard Navigation** - Arrow keys for modal navigation, ESC to close
- **Image Zoom** - Click to view full-size images
- **⌘K Search** - Command palette style search bar
- **Blur-to-Sharp Loading** - Smooth image transitions

### Animations
- **Card Hover** - Lift + indigo glow effect
- **Modal Stagger** - Sequential content reveal
- **Floating Orbs** - Ambient background animation
- **Segment Controls** - Smooth filter transitions

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Runtime | React 19 |
| Deployment | Vercel |
| Data | World Athletics API (ISR 1h) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/kimsain/new_shoes.git
cd new_shoes
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check |

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page (Server Component)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles + animations
├── components/
│   ├── Header.tsx         # Header with sync status
│   ├── ShoeGrid.tsx       # Grid with filters
│   ├── ShoeCard.tsx       # Card with progress bar
│   ├── ShoeModal.tsx      # Detail modal with stagger
│   ├── SearchBar.tsx      # Search with ⌘K hint
│   ├── BottomSheet.tsx    # Mobile filter sheet
│   ├── EmptyState.tsx     # No results state
│   └── filters/           # Filter components
├── styles/
│   └── tokens.ts          # Design tokens (Linear/Vercel style)
├── hooks/                 # Custom hooks
├── lib/                   # API utilities
├── types/                 # TypeScript interfaces
├── utils/                 # Utility functions
└── constants/             # App constants
```

## Design System

### Color Palette

| Element | Color |
|---------|-------|
| Background | Pure Black `#000000` |
| Surface | `#0a0a0a` → `#111111` gradient |
| Accent | Indigo `#6366f1` → Violet `#8b5cf6` |
| Glow | `rgba(99, 102, 241, 0.4)` |

### Status Colors

| D-Day | Color | Status |
|-------|-------|--------|
| ≤ 0 | 🔴 Red | Expired |
| ≤ 30 | 🟠 Amber | Urgent |
| ≤ 90 | 🔵 Sky | Warning |
| > 90 | 🟢 Emerald | Safe |

### Components

- `BG` - Background colors (page, surface, interactive, overlay)
- `ACCENT` - Indigo/violet gradients and glow effects
- `STATUS` - D-day status colors with progress bar
- `BUTTON` - Primary (gradient), secondary, ghost styles
- `FILTER` - Segment control, toggle chips, list items

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate shoes (modal) |
| `ESC` | Close modal/zoom |
| `⌘K` | Focus search |
| `Enter` | Select card |

## Responsive Layout

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
│ Search + Filter + Sort │
├────────────────────────┤
│ Shoe Grid              │
└────────────────────────┘
Filter → Bottom Sheet
```

## Data Source

All data from [World Athletics Shoe Checker](https://certcheck.worldathletics.org/FullList).

> **Note**: Development shoes are prototypes with limited approval periods. Not permitted in WAS Events or Olympic Games.

## License

This project is for educational purposes. All shoe data belongs to World Athletics.

---

<div align="center">

Made with ♥ by [kimsain](https://github.com/kimsain)

</div>
