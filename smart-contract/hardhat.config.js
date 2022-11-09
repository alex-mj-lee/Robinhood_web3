require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: ALCHEMY_URL,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
};
