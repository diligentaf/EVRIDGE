#!/bin/bash
FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm install npm -g
RUN npm install -g http-server
ARG VUE_APP_CLIENT_URL
ENV VUE_APP_CLIENT_URL=https://nanafy.com
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=https://api.nanafy.com
RUN npm install
RUN npm run build

# # production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]