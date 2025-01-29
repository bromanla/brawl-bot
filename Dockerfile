# Image
FROM node:23.6-alpine3.20

WORKDIR /app

COPY package*.json ./
COPY src ./src

RUN npm ci --omit=dev

CMD ["node", "--run", "start"]
