# ┌── builder ───────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# copy only package.json & tsconfig
COPY package.json tsconfig.json ./

# install dev + prod deps (creates lockfile in-image)
RUN npm install

# copy your source & compile
COPY src ./src
RUN npm run build

# ┌── runtime ───────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app

# pull in built artifacts
COPY --from=builder /app/dist ./dist

# install only prod deps
COPY package.json ./
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/index.js"]

