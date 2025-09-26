# /bot/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Instalar deps primero (cachea mejor)
COPY package*.json ./
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Puerto para Railway
ENV PORT=3000 NODE_ENV=production
EXPOSE 3000

# Arranque
CMD ["npm", "start"]
