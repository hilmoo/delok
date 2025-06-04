FROM node:22-alpine AS builder

WORKDIR /oracle
COPY . .
RUN npm run build


FROM gcr.io/distroless/nodejs22-debian12

COPY --from=builder /oracle/dist /app
CMD ["/app/index.js"]