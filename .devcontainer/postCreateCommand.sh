npm install --force

export HARDHAT_DISABLE_TELEMETRY_PROMPT=true
export HARDHAT_IGNITION_CONFIRM_DEPLOYMENT=false
cd _hardhat
rm -r ./ignition/deployments/
echo "$NODE_RPC_URL" | npx hardhat vars set NODE_RPC_URL
echo a | npx hardhat vars set INFURA_API_KEY
echo 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97 | npx hardhat vars set SEPOLIA_PRIVATE_KEY
npm install
npm run compile
npm run deploy:lmselemes
npm run deploy:certificate