FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache openssl

COPY api/package.json ./package.json
RUN npm install

COPY api ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY api/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]
