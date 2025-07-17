# Build aşaması
FROM node:18 as build
WORKDIR /app
COPY . .
ARG CONFIGURATION=default
RUN npm cache clean --force
RUN npm install --no-cache
RUN npm install -g @angular/cli
RUN if [ "$CONFIGURATION" = "production" ]; then \
        npm run build -- --configuration=production; \
    else \
        npm run build -- --configuration=development; \
    fi

# prpl-server aşaması
FROM node:18
WORKDIR /app
COPY --from=build /app/dist/tactical/browser /app
RUN npm install -g prpl-server

EXPOSE 8080
CMD ["prpl-server", "--root", "/app", "--host", "0.0.0.0", "--port", "8080"]
