npm install

cd _hardhat
rm -r ./ignition/deployments/
echo "$NODE_RPC_URL" | npx hardhat vars set NODE_RPC_URL
npm install
npm run compile
npm run deploy:lmselemes
npm run deploy:certificate