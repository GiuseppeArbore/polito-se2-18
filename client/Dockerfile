FROM node:lts-alpine3.18 as builder

ENV SERVER_ENV='http://server:3001/api'

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

ENV SERVER_ENV='http://server:3001/api'

COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
