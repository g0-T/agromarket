const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const appJson = require('./app.json');

const env = process.env.NODE_ENV || 'development';
const envFileName = `.env.${env}`;
const envFilePath = path.resolve(__dirname, envFileName);

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config();
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      apiUrl,
      sentryDsn,
      nodeEnv: env,
    },
  },
};
