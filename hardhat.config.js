/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-truffle5");
 require('@nomiclabs/hardhat-ethers');
 require('@openzeppelin/hardhat-upgrades');
 require("hardhat-gas-reporter");
 require('hardhat-contract-sizer');
 require('@nomiclabs/hardhat-etherscan')

 const {privateKey, apiKey} = require('./.secrets.json');

 module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-rpc.com",
      },
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [privateKey]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [privateKey],
      gasPrice: "auto",
      gas: "auto"
    },
    fuji: {
      url: "https://avalanche-fuji.rpc.thirdweb.com",
      accounts: [privateKey],
      gasPrice: "auto",
      gas: "auto"
    },
    avax: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [privateKey]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [privateKey],
      timeout: 100_000
    }
  },
  etherscan: {
    apiKey: {polygon: apiKey}
  },
  solidity: "0.7.6",
  gasReporter: {
    enabled: true
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
 };