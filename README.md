# ApplyFlow Web

React, Vite, and Tailwind frontend for the private ApplyFlow job-application tracker.

## Prerequisites

- Node.js 20+
- ApplyFlow API running locally or deployed

## Local setup

```sh
npm install
cp .env.example .env
```

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Run the app and checks:

```sh
npm run dev
npm test
npm run build
```

## Vercel

1. Import this repository into Vercel.
2. Use build command `npm run build` and output directory `dist`.
3. Add this production environment variable:

```env
VITE_API_BASE_URL=https://<api-domain>/api
```

4. Deploy. `vercel.json` keeps React Router deep links working.

Set the backend's `CORS_ORIGIN` to the deployed Vercel URL exactly, for example `https://<project>.vercel.app`.
