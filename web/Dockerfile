FROM node:20-alpine

WORKDIR /app

# Copia os manifestos do pacote e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Vite para o host
EXPOSE 5173

# Comando para rodar o servidor de desenvolvimento do Vite
# A flag --host é necessária para expor o servidor para fora do container
CMD ["npm", "run", "dev", "--", "--host"]