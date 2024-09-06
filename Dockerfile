# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /vm-node-red

# Copia los archivos package.json y package-lock.json al directorio de trabajo en el contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código fuente de la aplicación al directorio de trabajo en el contenedor
COPY . .

# Construye la aplicación de React
RUN npm run build

# Instala el paquete `serve` globalmente para servir archivos estáticos
RUN npm install -g serve

# Expone el puerto 8080 en el contenedor
EXPOSE 8080

# Define el comando por defecto para ejecutar cuando el contenedor se inicie
CMD ["serve", "-s", "dist", "-l", "8080"]
