FROM node:20-alpine

WORKDIR /workspace

RUN apk add --no-cache python3 make g++

COPY tsconfig.base.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/prisma/schema.prisma ./apps/backend/prisma/schema.prisma
RUN cd /workspace/apps/backend && npm install

COPY apps/backend/. /workspace/apps/backend/
WORKDIR /workspace/apps/backend

EXPOSE 5000

CMD ["npm", "run", "dev"]