FROM node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci --force

FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev --force

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ENV VITE_ELEMES_URL=https://elemes.hilmo.dev
ENV VITE_NODE_RPC_URL=https://sepolia.infura.io/v3/193e4d705b0141b4bdd6b16aae806723
ENV VITE_COOKIE_DOMAIN=delok.hilmo.dev
ENV VITE_BASE_URL=https://delok.hilmo.dev
ENV VITE_ISPROD=true
RUN npm run build

FROM node:22-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]