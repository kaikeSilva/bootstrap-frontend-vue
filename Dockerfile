FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Instala serve globalmente para servir arquivos estáticos
RUN npm install -g serve

# Expõe porta 3000
EXPOSE 3000

# Comando para servir a aplicação buildada
CMD ["serve", "-s", "dist", "-l", "3000"]