# DiploDocus

An interactive data visualization site for UN General Assembly and Security Council voting records (1992–2025), developed at the Science in Diplomacy Lab (SiDLab), University of Geneva / ETH Zurich.

## Overview

DiploDocus renders UN voting data on a choropleth world map and a sidebar dashboard, letting researchers and the public explore how member states voted across resolutions, years, and topics. Users can filter by year (with animated playback), browse individual resolutions, or narrow results to a subject area. Three map color modes reveal vote patterns in the default yes-rate view, the USA–China alignment split, or a bilateral comparison against any selected country. The Security Council view adds a P5 alignment scatter chart and a veto history donut broken down by permanent member. Resolution full text is fetched on demand from a Supabase backend.

## Features

- **Choropleth world map** — countries colored by yes-rate gradient (red → gray → green) using MapLibre GL JS and Natural Earth 110m GeoJSON
- **Three filter modes** — Year, Topic, and Resolution, switchable from the top bar
- **Year slider with playback** — scrub or animate from 1992 to 2025 at 800 ms per step
- **Resolution browser** — searchable modal listing all GA or SC resolutions; sortable by symbol, date, or controversy (no/abstain count); filterable by year
- **Topic filter** — select a UN subject area to aggregate votes across all matching resolutions
- **Map color modes** (GA only):
  - Default: per-country yes-rate
  - USA vs China: colors countries by which superpower they sided with on contested votes
  - vs Country: pick any country and color all others by voting agreement rate
- **Vote summary sidebar** — bar chart of vote distribution (resolution mode) or yes-rate quartiles (year/topic mode)
- **P5 alignment panel** (SC) — scatter axis showing where each permanent member sits on a No–Abstain–Yes spectrum, with an overall alignment score and an expandable detail modal
- **G20 and EU alignment panels** (GA) — same scatter axis for each bloc
- **Veto donut chart** (SC) — clickable donut segmented by P5 member, with a per-member veto list linked to UN records
- **Year-in-context panel** — curated headline, narrative, and clickable key resolution links for each year
- **Resolution content panel** — resolution symbol, title, subject tags, and a full-text modal sourced from Supabase
- **Country tooltip** — hover any country to see its vote or yes-rate statistics
- **Country picker modal** — search and select from the full member state list for bilateral comparison mode
- **About page** — project attribution for SiDLab, University of Geneva, and ETH Zurich

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 8 + TypeScript 5.9 (strict mode) |
| UI | React 19, Tailwind CSS 4 |
| Map | MapLibre GL JS 5, react-map-gl 8 |
| State | Zustand 5 |
| Charts | Observable Plot 0.6, D3 7 |
| Backend | Supabase (resolution full text) |
| Routing | React Router v7 |

## Prerequisites

- Node.js 20 or later
- npm (or pnpm / yarn)
- A Supabase project with a `resolution_content` table (optional — the map and dashboard work without it; only the full-text panel requires it)

## Installation

```bash
git clone <repo-url>
cd diplodocus
npm install
```

## Configuration

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-anon-key>
```

Both variables are optional. If omitted, the Supabase client is not initialised and resolution full text is silently skipped — all other features remain functional.

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | No | Supabase project REST URL |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | No | Supabase anon / publishable key |

## Usage

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The dev server starts at `http://localhost:5173` by default.

## Project Structure

```
diplodocus/
├── public/
│   ├── data/
│   │   ├── ga-resolutions.json        # 2 801 GA resolutions, 1992–2025
│   │   ├── sc-resolutions.json        # 2 093 SC resolutions, 1992–2025
│   │   ├── DPPA-SCVETOES.json         # SC veto records (DPPA source)
│   │   ├── geo/
│   │   │   └── countries.geojson      # Natural Earth 110m, ISO_A3 keyed
│   │   └── aggregates/
│   │       ├── yearly-ga.json         # Per-country yearly vote proportions (GA)
│   │       ├── yearly-sc.json         # Per-country yearly vote proportions (SC)
│   │       └── topics.json            # Subject → resolution ID index
├── src/
│   ├── App.tsx                        # Router root (/ and /about)
│   ├── store/
│   │   └── filterStore.ts             # Zustand store — all global filter state
│   ├── lib/
│   │   ├── types.ts                   # Canonical type definitions
│   │   ├── colors.ts                  # VOTE_COLORS, NO_DATA_COLOR
│   │   ├── supabase.ts                # Lazy Supabase client
│   │   ├── groupAlignment.ts          # G20 and EU member lists + alignment logic
│   │   ├── p5alignment.ts             # P5 alignment computation
│   │   ├── yearSummaries.ts           # Curated year-in-context narratives
│   │   └── vetoSummaries.ts           # Curated veto descriptions
│   ├── hooks/
│   │   ├── useVoteData.ts             # Core data hook — fetches, caches, and colors
│   │   ├── useVetoData.ts             # SC veto data hook
│   │   ├── useResolutionContent.ts    # Supabase full-text hook
│   │   └── useResolutionMeta.ts       # Resolution metadata hook
│   ├── components/
│   │   ├── Map/                       # VoteMap, MapLegend, MapModeBar,
│   │   │                              # CountryTooltip, CountryPickerModal
│   │   ├── Filters/                   # FilterBar, BodyToggle, YearSlider, TopicSelect
│   │   ├── Dashboard/                 # VoteSummary, P5AlignmentPanel, GroupAlignmentPanel,
│   │   │                              # VetoDonutPanel, YearContext, ResolutionContentPanel,
│   │   │                              # AlignmentModal, ResolutionFullTextModal, AllCountriesButton
│   │   ├── resolution/                # ResolutionPicker modal, VetoList
│   │   ├── layout/                    # Header, Footer, DiploLogo
│   │   └── CountryFlag.tsx            # Circle flag images via hatscripts CDN
│   └── pages/
│       ├── VotesPage.tsx              # Main view (map + sidebar)
│       └── AboutPage.tsx              # Project attribution
```

## Development

```bash
# Run the linter
npm run lint

# Type-check without emitting
npx tsc --noEmit
```

TypeScript strict mode is enforced. Components are capped at 200 lines — extract sub-components when approaching that limit. All shared data types belong in `src/lib/types.ts`. Global filter state lives exclusively in `src/store/filterStore.ts`. Use functional components with hooks throughout.

## Data

The raw source data was converted from CSV to JSON in a one-time Python script (not included in this repository). The resulting JSON files are committed to `public/data/` and served as static assets — no server-side data processing occurs at runtime. All data fetches are cached in module-level `Map` instances to avoid redundant network requests within a session.

Vote values follow the UN convention: `Y` (yes), `N` (no), `A` (abstain), `X` (non-voting / absent).
