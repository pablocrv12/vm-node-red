# Usa una imagen base de Node.js
FROM node:latest

# Instala git
RUN apt-get update && apt-get install -y git && apt-get clean

RUN git clone --branch Production https://github.com/pablocrv12/vm-node-red

WORKDIR /vm-node-red

RUN npm install

# Construye la aplicación de React
RUN npm run build

# Instala un servidor web simple para servir la aplicación estática
RUN npm install -g serve

# Expone el puerto en el que correrá la aplicación
EXPOSE 8080

# Comando para correr la aplicación usando 'serve'
CMD ["serve", "-s", "dist", "-l", "8080"]

# construir con: docker build --no-cache -t vm-node-red:latest .

# ejecutar con: docker run -d --name vm-nodered -p 8080:8080 vm-node-red:latest