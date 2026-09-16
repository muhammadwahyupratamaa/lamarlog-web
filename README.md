# LamarLog Web

React, Vite, and Tailwind frontend for the private LamarLog job-application tracker.

## Prerequisites

- Node.js 20+
- API backend running locally or deployed

## Local setup

```sh
npm install
cp .env.example .env
```

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=https://applyflow-api-roan.vercel.app/api
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
VITE_API_BASE_URL=https://applyflow-api-roan.vercel.app/api
```

4. Deploy. `vercel.json` keeps React Router deep links working.

Set the backend's `CORS_ORIGIN` to `https://lamarlog.vercel.app`.
