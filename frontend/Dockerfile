FROM node:alpine as build

WORKDIR app/frontend

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install -g npm@latest
COPY . .
RUN npm run dev

FROM nginx:stable-alpine

COPY --from=build app/dist app/usr/share/nginx/html
COPY --from=build nginx.conf app/etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]