# =========================
# Build Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =========================
# Runtime Stage
# =========================
FROM nginx:alpine

# Create non-root user
RUN addgroup -S nginxgroup && \
    adduser -S nginxuser -G nginxgroup

# Remove default nginx server config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Create writable directories
RUN mkdir -p \
    /tmp/client_temp \
    /tmp/proxy_temp \
    /tmp/fastcgi_temp \
    /tmp/uwsgi_temp \
    /tmp/scgi_temp \
    /var/cache/nginx \
    /var/log/nginx && \
    chown -R nginxuser:nginxgroup \
        /usr/share/nginx/html \
        /tmp \
        /var/cache/nginx \
        /var/log/nginx

USER nginxuser

EXPOSE 3000

CMD ["nginx","-g","daemon off;"]
