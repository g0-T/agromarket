# Frontend (Expo)

Frontend client for jr-agro-marketplace built with Expo and React Native.

## Setup

```bash
cd apps/frontend
pnpm install
```

This project uses `dotenv` to load environment files during build-time (`.env.development`, `.env.production`, etc.). `app.config.js` already reads the appropriate `.env.*` file.

## Environment

The frontend expects the following public environment variables (set in your `.env.*` files):

- `EXPO_PUBLIC_API_URL` — full backend API base URL including `/api` (e.g. `https://api.example.com/api`).
- `EXPO_PUBLIC_SENTRY_DSN` — Sentry DSN for error reporting (optional).

Examples (local development):

```bash
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_SENTRY_DSN=
```

If you maintain a separate backend `.env`, keep the backend `BACKEND_URL` aligned with `EXPO_PUBLIC_API_URL` to ensure consistency between services.

## Running

Start the Expo dev server:

```bash
pnpm run start
```

Other commands:

```bash
pnpm run android
pnpm run ios
pnpm run web
```

## Production checklist

- Ensure `NODE_ENV=production` during build.
- Provide `EXPO_PUBLIC_API_URL` pointing to your production backend (use the same `BACKEND_URL` used by the backend service).
- Provide `EXPO_PUBLIC_SENTRY_DSN` if you want Sentry error tracking in production.
- Remove any local `dist/` or build artifacts from the repo (they should be generated at build time).

## Documentation

- Production frontend guide: [docs/FRONTEND_DOCUMENTACION_PRODUCCION.md](docs/FRONTEND_DOCUMENTACION_PRODUCCION.md)

## Logging

This project uses a small `logger` utility (`src/utils/logger.ts`). Developers should use `logger.debug/info/warn/error` instead of `console.log` so logs behave appropriately in development and production and errors are reported to Sentry.

## Auth and API

The frontend uses `Authorization: Bearer <token>` for protected requests and integrates with the backend auth endpoints. Key files:

- `src/services/auth.service.ts`
- `src/services/api.service.ts`

Supported auth endpoints (backend):

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/phone/send-otp`
- `POST /api/auth/phone/verify-otp`

## Notes

- Keep comments in source files in English. User-facing text (UI strings) should remain Spanish where applicable.
- We removed several unused dependencies to keep the bundle size small. If your build fails because a dependency was removed incorrectly, re-add it to `package.json`.
