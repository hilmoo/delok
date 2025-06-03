npm install

cd _hardhat
rm -r ./ignition/deployments/
npm install
npm run compile
npm run deploy:lmselemes
npm run deploy:certificate