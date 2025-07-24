# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: producción
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Borra los archivos por defecto
RUN rm -rf ./*

# Copia el build generado desde el contenedor anterior
COPY --from=builder /app/dist .

# Copia un archivo custom de configuración si lo necesitas
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
