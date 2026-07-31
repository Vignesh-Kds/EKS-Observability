FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine


RUN addgroup -S nginxgroup && \
    adduser -S nginxuser -G nginxgroup


COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


RUN mkdir -p /tmp/client_temp \
    /tmp/proxy_temp \
    /var/cache/nginx \
    /var/run \
    && chown -R nginxuser:nginxgroup \
       /usr/share/nginx/html \
       /tmp \
       /var/cache/nginx \
       /var/run


USER nginxuser


EXPOSE 3000


CMD ["nginx", "-g", "daemon off;"]
