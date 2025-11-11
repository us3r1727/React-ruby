# syntax=docker/dockerfile:1
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar cache
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Entrypoint: cria .env se não existir e inicia o servidor de dev
CMD ["/bin/sh", "-c", "if [ ! -f .env ]; then cp .env.example .env; fi && npm run dev -- --host 0.0.0.0 --port 5173"]
