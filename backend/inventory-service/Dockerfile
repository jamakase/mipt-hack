FROM node:16-alpine AS node

FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder

WORKDIR /app
ADD ./package.json .
ADD ./package-lock.json .
RUN npm install

ADD ./ .
RUN npm run build

FROM node AS deps-builder
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm install --production

FROM node:16 AS indexer
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist .
COPY --from=deps-builder /node_modules ./node_modules

# RUN apt update && apt install -y ffmpeg

EXPOSE 3000

CMD ["node", "main.js"]
