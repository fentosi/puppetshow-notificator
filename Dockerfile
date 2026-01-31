FROM node:24.1.0-alpine3.20 AS build

ARG NPM_TOKEN

WORKDIR /app

COPY . .

RUN npm install -g npm@latest
RUN npm ci --only=production

FROM node:24.1.0-alpine3.20 AS deploy

WORKDIR /app

COPY --from=build /app /app
