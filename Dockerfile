FROM node:24.13.0-alpine3.23 AS build

ARG NPM_TOKEN

WORKDIR /app

COPY . .

RUN npm install -g npm@latest
RUN npm ci --omit=dev

FROM node:24.13.0-alpine3.23 AS deploy

WORKDIR /app

COPY --from=build /app /app
