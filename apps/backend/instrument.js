// Import with `import * as Sentry from "@sentry/node"` when using ESM
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://77ea856a22cce42415aaffe6c0e328ff@o4511310582382592.ingest.us.sentry.io/4511310616920064",
  environment: process.env.NODE_ENV || 'development',
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0,
});