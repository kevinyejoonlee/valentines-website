# Valentine's Website

A special website for Valentine's Day 2026.

## Live site

After you push to GitHub and the Pages workflow finishes, your live link will be:

- `https://kevinyejoonlee.github.io/valentines-website/`

## Getting Started

This project runs on **Next.js** (App Router).

## Development

Install dependencies:

```bash
npm install
```

If your photos live in `./cindy/`, copy them into Next's static folder (`./public/cindy/`):

```bash
npm run sync-assets
```

Start the dev server:

```bash
npm run dev
```

Or do both in one step:

```bash
npm run dev:assets
```

## Notes

- Next serves static files from `public/`, so photos must be available at `public/cindy/...` to load via `/cindy/...`.
- The previous plain-HTML version is kept under `legacy/` for reference.
