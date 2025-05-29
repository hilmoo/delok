FROM node:22-alpine

WORKDIR /usr/hardhat

COPY . .

RUN npm install --save-dev hardhat

EXPOSE 8545

ENTRYPOINT [ "npx", "hardhat", "node" ]