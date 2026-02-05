# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js website that displays World Athletics development shoes (prototypes awaiting full approval).

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server at http://localhost:3000
npm run build   # Production build
npm run lint    # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Data Fetching**: Server-side with ISR (revalidates every hour)

### Data Flow
1. `page.tsx` fetches HTML from World Athletics FullList page
2. Parses embedded JSON from `litProductsDataRaw` variable
3. Filters for development shoes (`isDevelopmentShoe === true` OR `status === 'APPROVED_UNTIL'`)
4. Passes data to client components for display

### Key Components
- `ShoeGrid` - Main grid with search/filter, groups by brand
- `ShoeCard` - Card showing shoe name, type, validity status
- `ShoeModal` - Full details with image, dates, disciplines

### Image URLs
Format: `https://certcheck.worldathletics.org/OpenDocument/{imageDocumentuuid}`

## Deployment

Deployed on Vercel. Push to `main` branch triggers automatic deployment.
