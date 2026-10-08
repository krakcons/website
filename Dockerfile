FROM node:24-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG EMDASH_DATABASE=postgres
ARG EMDASH_STORAGE=s3
ARG EMDASH_SITE_URL=https://krakconsultants.com
ENV EMDASH_DATABASE=$EMDASH_DATABASE
ENV EMDASH_STORAGE=$EMDASH_STORAGE
ENV EMDASH_SITE_URL=$EMDASH_SITE_URL
RUN npm run build
RUN npm prune --omit=dev

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
RUN mkdir -p /app/.astro && chown node:node /app /app/.astro
USER node
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
