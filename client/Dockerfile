FROM node:lts-alpine as builder

WORKDIR /app
COPY . ./

RUN npm install && npm run build

FROM nginx:alpine

COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
