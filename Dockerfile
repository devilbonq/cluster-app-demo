FROM node:18-alpine3.14
USER root
RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production
# PY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
