# Frontend Technical Documentation - JR Agro Marketplace

## 1. Executive Summary

This frontend is a React Native application built with Expo and Expo Router for the JR Agro Marketplace platform. It supports authentication, product discovery, lot detail views, transaction workflows, seller onboarding, and dashboard screens for buyers, sellers, and administrators.

Core stack:
- React Native 0.76
- Expo SDK 52
- Expo Router
- TypeScript
- Zustand for client state
- React Context for shared app-wide state
- Axios for API communication
- Expo Secure Store / Async Storage for persistence
- Sentry for runtime monitoring

Target environments:
- Mobile: iOS and Android
- Web: Expo web build
- Production: configured through Expo/EAS and public environment variables

---

## 2. Architecture Overview

### 2.1 Architectural Pattern

The frontend follows a layered, feature-oriented structure:

1. Routing layer
   - Expo Router handles navigation and route groups.
   - Protected routes are enforced by the root layout guard.

2. Screen layer
   - Screens are responsible for orchestrating UI composition and wiring hooks to business data.

3. Hook layer
   - Custom hooks encapsulate data fetching, form logic, and side effects.
   - They keep screens small and reusable.

4. Service layer
   - API services abstract backend calls and handle auth and token refresh.

5. State layer
   - Global application state is handled through React Context and Zustand.
   - Component-local state is used for UI-specific interactions.

### 2.2 Runtime Flow

```text
User interaction
  -> Screen / Component
  -> Custom hook
  -> Service (Axios)
  -> Backend API
  -> Response mapped into UI state
  -> Context / Zustand / local state update
  -> Re-render
```

---

## 3. Project Structure

```text
apps/frontend/
  app/                         # Expo Router entrypoints and route groups
    (auth)/
    (lots)/
    (tabs)/
    (transactions)/
    admin/
    _layout.tsx
    admin-dashboard.tsx
    privacy.tsx
    terms.tsx

  src/
    components/                # Reusable UI and feature components
      auth/
      lots/
      market/
      transactions/
      ui/
    context/                   # React Context providers
      AuthContext.tsx
      AppThemeContext.tsx
      CurrencyContext.tsx
    hooks/                     # Custom hooks for screens and features
      auth/
      dashboard/
      lots/
      market/
      publish/
      settings/
      transactions/
    screens/                   # Route-level screens
      auth/
      dashboard/
      lots/
      market/
      transactions/
    services/                  # API and platform services
      api.service.ts
      auth.service.ts
      notification.service.ts
    store/                     # Zustand stores
      use-user.store.ts
      use-dashboard.store.ts
    styles/                    # StyleSheet modules by feature
    types/                     # Shared TypeScript interfaces
    utils/                     # Helpers, storage, logger, API config
  assets/                      # Images, icons, static media
  app.config.js                # Expo config
  app.json                     # Expo metadata
  eas.json                     # EAS build config
  package.json                 # Dependencies and scripts
```

### 3.1 Main Responsibilities by Folder

- app/: file-based routing, root layout, route guards, shell screens.
- src/screens/: top-level screens mapped to routes.
- src/components/: reusable presentational and feature-driven UI blocks.
- src/hooks/: business logic and data-fetching orchestration.
- src/services/: backend API integration and platform-specific services.
- src/context/: shared cross-cutting state such as auth, theme, and currency.
- src/store/: global client-side state split from React Context where needed.
- src/styles/: theme-driven styling and screen-specific StyleSheet modules.

---

## 4. State Management Architecture

The frontend uses a hybrid state model:

### 4.1 React Context

Used for app-wide, cross-cutting state that needs a provider tree:

- AuthContext
  - Owns current user session state.
  - Initializes auth on startup.
  - Exposes signIn, signUp, signOut, refreshUser, and updateUser.
  - Synchronizes the user state with Zustand and secure storage.

- AppThemeContext
  - Manages light/dark theme and color tokens.
  - Exposed through the useAppTheme hook.

- CurrencyContext
  - Tracks BCV exchange rate data and provides conversion helpers across the app.

### 4.2 Zustand Stores

Used for lighter, persistent client-side state that does not need a full provider tree:

- useUserStore
  - Holds the normalized user profile for UI consumption.
  - Useful for screens that need user data without depending on the auth context directly.

- useDashboardStore
  - Tracks the active dashboard view and navigation state.
  - Used for navigation flows and UI state within dashboard screens.

### 4.3 Local Component State

Used for ephemeral UI state such as:
- form input values
- modal visibility
- tab selection
- media selection
- loading flags

### 4.4 State Flow Example

For a typical authenticated flow:

1. The app boots and AuthProvider initializes.
2. AuthProvider calls the auth service and refreshes the session.
3. The user object is stored in React Context and mirrored to useUserStore.
4. Screens consume the hydrated user state via hooks such as useAuth.
5. Feature hooks fetch data from backend services and update local state or Zustand stores.

---

## 5. API and Service Layer

### 5.1 Central API Client

The main HTTP client lives in [../src/services/api.service.ts](../src/services/api.service.ts).

Responsibilities:
- Create a shared Axios instance.
- Attach the Authorization header automatically.
- Handle token refresh on 401 responses.
- Clear auth state on session expiry.

The request lifecycle is:
- Read the access token from storage.
- Attach it to the request header.
- If a 401 occurs and a refresh token exists, refresh the token.
- Retry the original request.
- If refresh fails, clear storage and force logout.

### 5.2 Service Modules

Relevant services include:
- auth.service.ts: login, register, token management, logout.
- notification.service.ts: push notifications and notification settings.
- Additional feature-specific services can be added under src/services/ as the app grows.

### 5.3 Storage and Auth Persistence

The frontend uses secure storage and async storage abstractions for:
- access token
- refresh token
- basic user context

This ensures that sessions survive app restarts without exposing credentials directly in memory.

---

## 6. Navigation and Routing

### 6.1 Expo Router Structure

The app uses file-based routing under the app/ directory.

Main route groups:
- (auth): login, registration, OTP verification
- (tabs): main buyer/seller experience
- (lots): lot detail and related flows
- (transactions): transaction management and commercial lifecycle
- admin: administrator dashboard and tools

### 6.2 Root Navigation Guard

The root layout in app/_layout.tsx performs the following:
- initializes auth state
- checks whether the user is authenticated
- redirects unauthenticated users to login
- redirects unverified users to OTP verification
- sends admin users to the admin section
- prevents redirect loops during navigation

This is the main gatekeeper for the production experience.

---

## 7. Key Screens and Components

The following are the three most critical screens/components in the current system.

### 7.1 Auth Screen

File:
- [../src/screens/auth/Login.tsx](../src/screens/auth/Login.tsx)

Responsibilities:
- Renders the authentication experience for login and registration.
- Supports responsive desktop/mobile layouts.
- Delegates form behavior to the auth hook and AuthForm component.
- Presents the typed marketing/feature panel for the app.

Expected props:
- None. The screen is route-driven and uses hooks for all state.

Dependencies:
- useAuthForm
- AuthForm
- useAppTheme
- SafeArea and keyboard utilities

Why it matters:
- It is the front door to the entire marketplace and controls access to all protected areas.

### 7.2 Market Screen

File:
- [../src/screens/market/MarketScreen.tsx](../src/screens/market/MarketScreen.tsx)

Responsibilities:
- Acts as the main marketplace entry point.
- Detects the viewport width and switches between mobile and desktop layouts.
- Collects market data through the market hook.
- Injects currency conversion and theme data into the layout components.

Expected props:
- None. It composes layout props from hooks and context.

Dependencies:
- useMarket
- useCurrency
- useAppTheme
- MarketMobileLayout / MarketDesktopLayout

Why it matters:
- This is the core discovery experience where buyers find and evaluate livestock lots.

### 7.3 Lot Detail Screen

File:
- [../src/screens/lots/LotDetailScreen.tsx](../src/screens/lots/LotDetailScreen.tsx)

Responsibilities:
- Displays the complete product detail experience.
- Renders media, pricing, descriptors, stats, seller data, and offer actions.
- Handles animated scrolling and layout adaptation for desktop and mobile.
- Delegates detailed behavior to the lot-detail hook and subcomponents.

Expected props:
- None. It relies on route context and hook results rather than incoming props.

Dependencies:
- useLotDetail
- MediaViewer
- LotHeader / LotFooter / LotTitleSection / SellerCard
- useAppTheme

Why it matters:
- This is the main conversion surface where product interest becomes a commercial action.

---

## 8. Styling and UI Conventions

The UI follows a modular styling approach:

- Screen-specific styles are placed in src/styles/screens/.
- Component-specific styles are colocated with the component or under src/styles/components/.
- The app uses theme-aware colors and spacing helpers through the useAppTheme hook.
- The codebase favors React Native StyleSheet over inline styling for maintainability.

Recommended conventions:
- Keep presentation components stateless when possible.
- Move business logic into hooks.
- Reuse existing UI primitives before creating new ones.
- Keep user-facing copy in Spanish where it is already part of the product experience.

---

## 9. Production Readiness Checklist

### 9.1 Environment Variables

Required public variables:
- EXPO_PUBLIC_API_URL: backend API base URL, including /api
- EXPO_PUBLIC_SENTRY_DSN: optional but strongly recommended for production monitoring

Example:
```bash
EXPO_PUBLIC_API_URL=https://api.example.com/api
EXPO_PUBLIC_SENTRY_DSN=https://example@o0.ingest.sentry.io/000000
```

### 9.2 Build and Deployment

Install dependencies:
```bash
cd apps/frontend
pnpm install
```

Web production build:
```bash
pnpm run build
```

Expo/EAS mobile build:
```bash
eas build --platform android
eas build --platform ios
```

### 9.3 Monitoring and Error Handling

- Sentry is wired for runtime diagnostics.
- The app uses a centralized logger utility instead of raw console logging.
- Error boundaries are present at the app root.

### 9.4 Performance Recommendations

- Avoid large inline style objects in render paths.
- Keep screen-level hooks lean and memoize expensive computations when needed.
- Profile image loading and media-heavy screens before release.
- Use lazy-loading patterns when feature complexity grows.

---

## 10. Development Environment and Setup Guide

### 10.1 Environment Variables Template

#### Backend (.env)

Local development:
```env
NODE_ENV=development
PORT=5000
DATABASE_CONNECTION_STRING=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
STORAGE_PROVIDER=local
STORAGE_CONNECTION_STRING=./uploads
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:8081
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
REFRESH_SECRET=replace_with_a_long_random_secret
CHAT_ENCRYPTION_KEY=replace_with_a_long_random_secret
TRUSTED_ORIGINS=http://localhost:8081,http://localhost:19006
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

Production:
```env
NODE_ENV=production
PORT=5000
DATABASE_CONNECTION_STRING=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
STORAGE_PROVIDER=local
STORAGE_CONNECTION_STRING=/srv/app/uploads
BACKEND_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
REFRESH_SECRET=replace_with_a_long_random_secret
CHAT_ENCRYPTION_KEY=replace_with_a_long_random_secret
TRUSTED_ORIGINS=https://app.example.com
CORS_ALLOWED_ORIGINS=https://app.example.com
```

#### Frontend (.env or .env.development)

Local development:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_SENTRY_DSN=
```

Production:
```env
EXPO_PUBLIC_API_URL=https://api.example.com/api
EXPO_PUBLIC_SENTRY_DSN=https://example@o0.ingest.sentry.io/000000
```

### 10.2 Installation from Scratch

#### Prerequisites
- Node.js and npm
- A PostgreSQL instance reachable from the backend
- A terminal with access to the repository

#### Backend
```bash
cd apps/backend
pnpm install
cp env.local .env
# edit .env with your local database and secrets
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run dev
```

Expected result:
- The backend starts on http://localhost:5000
- Prisma applies the existing migrations to the configured database

#### Frontend
```bash
cd apps/frontend
pnpm install
cp .env.development .env
# edit .env with your backend URL
pnpm exec expo start
```

For mobile devices, scan the Expo QR code. For web, open the local Expo web preview in the browser.

### 10.3 Authentication Flow

The authentication flow is implemented as a bearer-token session flow:

1. The user opens the login screen and submits credentials.
2. The frontend auth hook calls the auth service, which sends the request to the backend auth endpoint.
3. The backend validates the credentials and issues a session token (conceptually similar to a JWT-style access token).
4. The frontend stores the token locally and includes it in the Authorization header for future requests.
5. Every protected request goes through the API client, which attaches the token automatically.
6. The backend middleware reads the token, validates it, and authorizes or rejects the request before the controller logic runs.

In practice, the flow is:
```text
React Native app
  -> Auth hook / Auth service
  -> Backend /api/auth/* endpoint
  -> Token issued and stored
  -> Axios request with Authorization: Bearer <token>
  -> Backend middleware validates token
  -> Controller executes if authorized
```

If the token expires or is invalid, the client can attempt refresh using the refresh-token flow. If refresh fails, the app clears the stored auth state and redirects the user back to login.

---

## 11. Recommended Next Steps Before Release

1. Validate all production environment variables in the target environment.
2. Confirm the backend URL and auth flow work end-to-end on staging and production.
3. Verify the marketplace, lot detail, and transaction flows on mobile and web.
4. Test push notifications, OTP flows, and location-based actions on real devices.
5. Review Sentry logs and fix high-severity frontend issues before launch.

---

## 12. Summary

The frontend is already structured around a scalable Expo Router architecture with clear layers for screens, hooks, services, and state. The most important areas for production stability are authentication, marketplace browsing, and lot detail conversion flows. With the current structure, the app is well-positioned for growth and safe rollout if environment configuration, monitoring, and release validation are completed carefully.
