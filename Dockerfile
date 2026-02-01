# Usa Node.js 18 Alpine para imagen ligera
FROM node:18-alpine

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias de producción
RUN npm ci --only=production

# Copia el resto del código
COPY . .

# Cloud Run establece PORT automáticamente
ENV PORT=8080
ENV NODE_ENV=production

# Expone el puerto
EXPOSE 8080

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {if(r.statusCode !== 200) throw new Error('Health check failed')})"

# Comando de inicio
CMD ["node", "app.js"]
