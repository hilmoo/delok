FROM node:22-alpine AS builder

WORKDIR /oracle
COPY . .
RUN npm install
RUN npm run build

FROM node:22-alpine AS dev

COPY --from=builder /oracle/dist /app
CMD ["node", "/app/index.js"]

FROM node:22-alpine
ENV NODE_ENV=production
COPY --from=builder /oracle/dist /app
CMD ["/app/index.js"]