FROM node:21-alpine as builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .
RUN pnpm install
RUN pnpm build  --ignore-ts-errors

FROM node:21-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY --from=builder /app/build .

#COPY --from=builder /app/.env.prod .env

RUN pnpm install --prod

EXPOSE 3333

CMD [ "node", "bin/serverjs" ]