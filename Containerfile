FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

# Install netcat for debugging connections
RUN apk add --no-cache netcat-openbsd

ENV NODE_ENV=production

# Add a healthcheck to the container
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

EXPOSE 4000

CMD ["node", "dist/index.js"]