require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config()

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "localhost",
  allowUnlimitedContractSize: true,
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: {
        mnemonic: "fee again demand uphold hammer cannon one middle frown gospel ancient evil",
        count: 20
      }
    },
    sepolia: {
      url: process.env.AU_SEPOLIA_RPC_URL,
      accounts: [process.env.TEST_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  }
};
