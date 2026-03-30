# Photomapper — CLAUDE.md

## What this app does

Photomapper is a geolocation-based photo sharing web app. Users upload photos with a location (picked manually on a map or extracted from image EXIF metadata), then view them on an interactive map and a scrollable photo feed.

## Tech stack

- **Framework**: Next.js 16 (App Router, `app/` directory)
- **UI**: React 19, Tailwind CSS 4
- **State**: Redux Toolkit 2 — global auth/UI state via slices, server data via RTK Query
- **Map**: MapLibre GL 5 + react-map-gl 8
- **Auth + DB + Storage**: Supabase (email/password + Google OAuth)
- **Forms**: React Hook Form 7 + Zod validation
- **Image processing**: exifr (GPS from EXIF), canvas API (resize to base64 JPEG)

## Running the app

```bash
npm run dev        # start dev server at localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Requires a `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

The app gracefully falls back to hardcoded mock data when Supabase is not configured — useful for local development and tests.

## Running tests

```bash
npm run test           # run all tests once
npm run test:watch     # watch mode
npm run test:coverage  # coverage report
npm run test:ui        # Vitest browser UI
```

## Architecture

### Component hierarchy

```
atoms/       — base UI primitives (Button, Input, Avatar, Spinner, MapPin)
molecules/   — composed components (PhotoCard, ModalShell, ImagePicker, LocationPicker, NavTab, FormField, MapCanvas, PhotoMarker, PhotoPopup, GoogleSignInButton)
organisms/   — feature-level components (Header, PhotoFeed, MapView, UploadModal, AuthModal, BottomNav)
```

### State management

- `store/authSlice.ts` — `{ user, isLoading }` — synced from Supabase via `AuthProvider`
- `store/uiSlice.ts` — `{ focusedPhotoId, mobileTab, isUploadOpen, isAuthOpen }`
- `store/photosApi.ts` — RTK Query endpoints: `getPhotos` (GET `/api/photos`) and `uploadPhoto` (POST `/api/upload`)

### API routes

- `app/api/photos/route.ts` — GET, returns photos from Supabase (or mock data)
- `app/api/upload/route.ts` — POST, requires auth; validates with Zod, uploads to Supabase Storage, inserts DB record

### Key utilities

- `lib/exif.ts` — `extractGpsFromFile(file)` → `{lat, lng} | null`
- `lib/image.ts` — `resizeImage(file, maxSize?)` → base64 JPEG data URL (max 500px)
- `lib/photos.ts` — `getPhotos()`, `insertPhoto()` — Supabase DB queries
- `lib/timeAgo.ts` — `timeAgo(dateString)` → human-readable relative time
- `lib/mapUtils.ts` — `photoCenter(photos)` → map center + zoom from photo bounding box

### Path alias

`@/*` maps to the project root (e.g. `@/components/atoms/Button`).

## Testing notes

**Framework**: Vitest + React Testing Library + MSW. `"module": "esnext"` + `"moduleResolution": "bundler"` in tsconfig means Jest would require heavy transform config — Vitest uses the same Vite ESM pipeline as Next.js.

**MapLibre GL**: Calls WebGL APIs unavailable in JSDOM. Always mock via `__mocks__/react-map-gl/maplibre.tsx` and `__mocks__/maplibre-gl.ts`. Any component importing these without the mock will crash the test suite.

**Supabase**: Always mock in tests — never make real network calls. Use the factory in `tests/helpers/mockSupabase.ts`. Three entry points to mock independently:
- `@/lib/supabase-browser` — browser client (components)
- `@/lib/supabase-server` — server client (API routes)
- `@/lib/supabase` — legacy singleton (lib/photos.ts)

**RTK Query in component tests**: Use MSW (`tests/mocks/handlers.ts`) to intercept `/api/photos` and `/api/upload` at the network level rather than fighting RTK Query internals.

**Redux in component tests**: Use `renderWithProviders` from `tests/helpers/renderWithProviders.tsx` — creates a real store with preloadable state.

**Browser APIs mocked globally** in `tests/setup.ts`:
- `navigator.geolocation`
- `HTMLCanvasElement.prototype.getContext` + `toDataURL`
