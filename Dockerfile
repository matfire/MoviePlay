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

RUN pnpm install --prod

EXPOSE 3333
ENV PORT=3333
ENV HOST=0.0.0.0

CMD [ "node", "bin/server.js" ]