# Authentication Setup for AgroMarket

This document describes the current authentication setup for AgroMarket using Better Auth, email/password login, Google OAuth, and OTP verification.

## Project layout

The repository is organized as a pnpm monorepo:

- apps/backend: Express/TypeScript backend API
- apps/frontend: Expo/React Native client
- packages/shared-types: shared TypeScript definitions used across apps

## Required environment variables

The backend uses the following auth-related environment variables:

- `DATABASE_URL` — database connection string
- `BETTER_AUTH_SECRET` — secret key used by Better Auth
- `BETTER_AUTH_URL` — backend base URL used by Better Auth and callback generation
- `FRONTEND_URL` — frontend origin for CORS and trusted origins
- `JWT_SECRET` — JWT signing secret (falls back to `BETTER_AUTH_SECRET` if missing)
- `REFRESH_SECRET` — refresh token signing secret (falls back to `BETTER_AUTH_SECRET` if missing)
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `RESEND_API_KEY` — Resend API key for sending email
- `RESEND_FROM` — verified sender address for email messages
- `SUPABASE_URL` — Supabase project URL for storage and token persistence
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `SUPABASE_ANON_KEY` — Supabase anon key
- `TWILIO_ACCOUNT_SID` — Twilio account SID for SMS delivery
- `TWILIO_AUTH_TOKEN` — Twilio auth token for SMS delivery
- `TWILIO_PHONE_FROM` — Twilio phone number used as SMS sender

## Better Auth configuration

The backend uses `better-auth` with the following features:

- Email/password login enabled
- Email verification sent automatically on sign-up
- Auto sign-in after email verification
- Google OAuth provider configured via `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- Custom user fields for `role`, `phone`, and `phoneVerified`

Trusted origins include:
- `FRONTEND_URL`
- `exp://localhost:19000`
- `http://localhost:19006`

## Local development example

Example `.env` values for local development:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:19006"
JWT_SECRET="your-jwt-secret"
REFRESH_SECRET="your-refresh-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM="no-reply@your-domain.com"
SUPABASE_URL="https://your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_ANON_KEY="your-anon-key"
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_FROM="+1234567890"
```

## Auth endpoints

The backend exposes the following auth endpoints under `/api/auth`:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/phone/send-otp`
- `POST /api/auth/phone/verify-otp`
- `GET /api/auth/verify`
- `GET /api/auth/callback/google` (Better Auth Google callback)

## Frontend integration

The frontend uses `EXPO_PUBLIC_API_URL` to point to the backend API base URL. The auth service stores tokens in AsyncStorage and refreshes expired access tokens automatically.

Example for frontend env:

```bash
export EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## Generating a secret

Generate a new secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the result for `BETTER_AUTH_SECRET`.

## Notes

- `BETTER_AUTH_URL` should match the backend URL where the API is served.
- `FRONTEND_URL` should match the app origin used by the frontend.
- Google OAuth will use Better Auth’s callback URL under `/api/auth/callback/google`.
- If email verification is enabled, users receive a verification email on registration.