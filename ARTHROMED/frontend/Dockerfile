# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build -- --configuration production

# Serve Stage with Nginx Alpine
FROM nginx:alpine AS runner
COPY --from=builder /app/dist/arthromed-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
