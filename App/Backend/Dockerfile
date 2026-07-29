# ==========================================================
# Stage 1 - Install Dependencies
# ==========================================================

FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# ==========================================================
# Stage 2 - Production Image
# ==========================================================

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
