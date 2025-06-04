FROM node:22-alpine AS builder

WORKDIR /oracle
COPY . .
RUN npm run build

FROM node:22-alpine AS dev

COPY --from=builder /oracle/dist /app
CMD ["node", "/app/index.js"]

FROM gcr.io/distroless/nodejs22-debian12 AS prod
ENV NODE_ENV=production
COPY --from=builder /oracle/dist /app
CMD ["/app/index.js"]