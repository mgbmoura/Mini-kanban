FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências primeiro (otimiza cache)
COPY api/pnpm-lock.yaml api/package.json api/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copia o restante dos arquivos da API
COPY api/ .

RUN npx prisma generate
RUN pnpm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache openssl
WORKDIR /usr/src/app

# Copia apenas o necessário para rodar
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/main"]
