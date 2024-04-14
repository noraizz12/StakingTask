require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// hardhat.config.js

require("dotenv").config();

const { API_URL, PRIVATE_KEY, API_KEY } = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/KLAT9gfMe89ssTnHJf1GF4tk3VYMf-EW",
      chainId: 80001,
      // gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    SepoliaETH: {
      url: "https://sepolia.infura.io/v3/3df44251533e4df3b1f0407d6ec4f34b",
      chainId: 11155111,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: API_KEY,
    // apiKey: {
    //   polygonMumbai: "XCTWB3K8Z1KQXWP9NVC8CC6HWN2B3ICMQD",
    // },
  },
};
