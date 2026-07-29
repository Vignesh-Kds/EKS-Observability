FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN addgroup -S nginxgroup && \
    adduser -S nginxuser -G nginxgroup

RUN chown -R nginxuser:nginxgroup \
    /usr/share/nginx/html \
    /var/cache/nginx \
    /var/run \
    /var/log/nginx

USER nginxuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
