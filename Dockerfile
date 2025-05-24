FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install
RUN npm install -D sass

# Copia código fonte
COPY . .

# Expõe porta 3000
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento com hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]