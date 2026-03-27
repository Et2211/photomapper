# Photomapper

A photo-sharing map app built with Next.js, Supabase, and MapLibre GL.

## Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## Running locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Without Supabase configured, it loads with mock photo data so the map and feed still work.
