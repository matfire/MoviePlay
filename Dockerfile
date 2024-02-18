FROM node:21-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN node ace build  --ignore-ts-errors

FROM node:21-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/build .

#COPY --from=builder /app/.env.prod .env

RUN npm i --omit=dev

EXPOSE 3333

ENTRYPOINT [ "/sbin/tini", "--", "node", "bin/server.js" ]