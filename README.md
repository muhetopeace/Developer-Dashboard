# Developer Dashboard

A simple developer dashboard showcasing:

- GitHub profile stats (avatar, repos, followers, following)
- Current weather by city (temperature, condition, wind, current time)
- Light/Dark mode toggle with persistence

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Fetch API
- Open APIs:
  - GitHub Users API
  - Open-Meteo Geocoding + Weather APIs (no API key required)

## Screenshots

(Add your screenshot here)

## Getting Started

### Prerequisites
- Node 18+

### Setup

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Configuration

- Default GitHub username is set to `octocat` in `src/App.tsx`.
- Default city is `San Francisco`. You can change both in `src/App.tsx`.

## Folder Structure

```
developer-dashboard/
  index.html
  package.json
  postcss.config.cjs
  tailwind.config.js
  tsconfig.json
  src/
    index.css
    main.tsx
    App.tsx
    components/
      Navbar.tsx
      GitHubCard.tsx
      WeatherCard.tsx
      Loading.tsx
      ErrorCard.tsx
    utils/
      theme.ts
```

## Deployment

You can deploy to a static host (Vercel, Netlify, GitHub Pages). Build and upload the `dist` folder.

```bash
npm run build
```

## Commit Suggestions

- Added GitHub API integration
- Implemented Light/Dark mode toggle
- Styled dashboard cards with Tailwind CSS


