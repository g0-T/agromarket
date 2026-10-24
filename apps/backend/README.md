# jr-agro-marketplace Backend

Backend API for AgroMarket built with Express, TypeScript, Prisma, Azure Blob Storage, and Better Auth.

## Quickstart (development)

1. Copy environment variables from `.env.example` to `.env` and update values for development.
2. Install dependencies:
   ```bash
   cd apps/backend
   pnpm install
   ```
3. Use a local database connection for development (example):
   ```env
   DATABASE_CONNECTION_STRING="file:./prisma/dev.db"
   ```
4. Run migrations (development):
   ```bash
   npx prisma migrate dev --name init
   ```
5. (Optional) Seed development data:
   ```bash
   npx tsx src/prisma/seed.ts
   ```

   Known test accounts seeded by default:
   - `owner@agromarket.com` / `11111111` (admin owner, full system access)
   - `seller@agromarket.com` / `11111111` (seller access)
   - `buyer@agromarket.com` / `11111111` (buyer access)

   For a dedicated test database, create `apps/backend/.env.test` from `.env.test.example` and run:
   ```bash
   pnpm run seed:test
   ```
6. Start the development server:
   ```bash
   pnpm run dev
   ```

## Production checklist

- Ensure `NODE_ENV=production`.
- Provide all required production environment variables (see below).
- Use a managed PostgreSQL (or other supported RDBMS) and run migrations with `prisma migrate deploy`.
- Back up production database before applying sensitive migrations (see migration READMEs).
- Build the app and run the compiled bundle:
  ```bash
  pnpm run build
  pnpm start
  ```

## Environment variables (current)
The backend validates and normalizes several environment variables at startup. In production missing critical values will cause the process to exit. Key variables used by the app:

- `NODE_ENV` — `production` or `development` (default: `development`).
- `PORT` — server port (default: `5000`).
- `DATABASE_CONNECTION_STRING` — full connection string for your DB (required in production).
- `DATABASE_CONNECTION_LIMIT` — optional connection pool size (default: 10).
- `DATABASE_SSL_MODE` — `disable|require|verify-full` (default: `disable`).
- `DATABASE_SSL_CA` — PEM certificate or base64-encoded CA (required if `verify-full`).
- `STORAGE_PROVIDER` — `azure` or `local` (default: `local` in development; required in production).
- `STORAGE_CONNECTION_STRING` — provider-specific connection string or local path (default: `./uploads` in development; required in production).
- `BACKEND_URL` — public backend base URL (required in production).
- `FRONTEND_URL` — frontend origin (required in production).
- `BETTER_AUTH_URL` — optional; if not set, defaults to `BACKEND_URL/api/auth` when `BACKEND_URL` exists.
- `BETTER_AUTH_SECRET` / `JWT_SECRET` — authentication secret(s). In production at least one must be set. In development the app falls back to safe dev defaults.
- `REFRESH_SECRET` — refresh token secret (falls back to `BETTER_AUTH_SECRET` in development; required in production).
- `CHAT_ENCRYPTION_KEY` — key used to encrypt chat messages (falls back to `BETTER_AUTH_SECRET` in development; required in production).
- `RESEND_API_KEY`, `RESEND_FROM` — for transactional email (Resend).
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_FROM` — for SMS OTP flows.

See `src/config/env.config.ts` for the authoritative validation and defaults.

## Database & storage

- Supported DBs: PostgreSQL (recommended for production), SQLite (development), MySQL/MariaDB (alternatives).
- Storage providers: Azure Blob Storage (`azure`) and local filesystem (`local`). The `STORAGE_PROVIDER` + `STORAGE_CONNECTION_STRING` determine runtime behavior.

### Production migration example

```bash
# Apply migrations on production DB
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## Auth and token flow

The backend integrates with Better Auth and also exposes custom OTP endpoints for email and phone verification.

### Auth endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/phone/send-otp`
- `POST /api/auth/phone/verify-otp`
- `GET /api/auth/verify`

Protected routes require an `Authorization: Bearer <token>` header.

## Main API routes (high level)

- Products, Seller applications, Transactions, Favorites, Notifications, Currency, User profile, Admin endpoints.

Refer to the route handlers in `src/routes` for the full list and latest changes.

## Build

Compile the backend using:
```bash
npm run build
```

## Notes

- The app normalizes URLs and trims trailing slashes for `BACKEND_URL` and `BETTER_AUTH_URL`.
- Secrets are strictly validated in production: missing critical secrets will cause the process to throw and exit.
- For any migration that modifies constraints or adds RLS/indexes, read the corresponding migration README (see `prisma/migrations/*/README.md`).
