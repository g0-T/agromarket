FROM node:20-alpine

WORKDIR /app

# Install pnpm via corepack to match monorepo workspace layout
RUN corepack enable && corepack prepare pnpm@8.8.0 --activate

# Copy workspace lockfiles and frontend package metadata
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies for the workspace, filtering to the frontend package

RUN pnpm install --filter ./apps/frontend...

# Copy the frontend source into the image under apps/frontend
WORKDIR /app/apps/frontend
COPY apps/frontend/. ./
# Ensure frontend package node_modules points to workspace node_modules (pnpm hoisted layout)
RUN rm -rf node_modules || true && ln -s /app/node_modules ./node_modules || true

EXPOSE 19006 19000 19001 19002 8081

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_PACKAGER_HOSTNAME=0.0.0.0

CMD ["pnpm", "start", "--", "--web", "--host", "0.0.0.0", "--port", "19006"]
