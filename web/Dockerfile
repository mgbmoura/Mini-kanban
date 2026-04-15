FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /usr/src/app

# Copia arquivos de dependências
COPY web/package.json web/pnpm-lock.yaml* ./

RUN pnpm install

# Copia o código do frontend
COPY web/ .

RUN pnpm run build

FROM nginx:alpine

# Copia o build para o diretório do Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
