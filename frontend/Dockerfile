FROM node:alpine as build

WORKDIR /usr/app/front

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install -g npm@latest
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /usr/app/front/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]