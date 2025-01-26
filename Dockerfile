# Image
FROM node:23.5-alpine3.20

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --omit=dev

CMD ["node", "--run", "start"]
