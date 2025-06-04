npm install

cd _hardhat
rm -r ./ignition/deployments/
echo "$NODE_RPC_URL" | npx hardhat vars set NODE_RPC_URL
echo a | npx hardhat vars set INFURA_API_KEY
echo a | npx hardhat vars set SEPOLIA_PRIVATE_KEY
npm install
npm run compile
npm run deploy:lmselemes
npm run deploy:certificate