# Builder
FROM node:20.8.0-alpine3.17 as builder
LABEL stage=builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Image
FROM node:20.8.0-alpine3.17

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --omit=dev

CMD ["npm", "start"]
