import Web3 from "web3";
import {
  MISSING_EXTENSION_ERROR,
  SoftwareWalletType,
  UninstallExtensionException,
} from "../constant/uninstallExtentionException";
import {
  CHN_TOKEN_MAINNET_ABI,
  CHN_TOKEN_RINKEBY_ABI,
  GOVERNENCE_MAINNET_ABI,
  GOVERNENCE_RINKEBY_ABI,
  STAKE_CONTRACT_ABI,
} from "./../constant/constants";

const web3 = new Web3(window.ethereum);

const enviroment = process.env.REACT_APP_ENV;
export const checkInstallExtension = () => {
  if (!window.ethereum || !window.web3) {
    const exception: UninstallExtensionException = {
      walletType: SoftwareWalletType.METAMASK,
      message: MISSING_EXTENSION_ERROR,
    };
    throw exception;
  }
};
export const governance = () => {
  const governanceABI =
    enviroment === "prod" ? GOVERNENCE_MAINNET_ABI : GOVERNENCE_RINKEBY_ABI;
  const governanceAddress =
    enviroment === "prod"
      ? process.env.REACT_APP_GOVERNANCE_MAIN_ADDRESS
      : process.env.REACT_APP_GOVERNANCE_TESTNET_ADDRESS;
  return new web3.eth.Contract(JSON.parse(governanceABI), governanceAddress);
};

export const getCHNBalance = () => {
  const chnABI =
    enviroment === "prod" ? CHN_TOKEN_MAINNET_ABI : CHN_TOKEN_RINKEBY_ABI;
  const chnAddress =
    enviroment === "prod"
      ? process.env.REACT_APP_MAIN_CHN_TOKEN_ADDRESS
      : process.env.REACT_APP_TEST_CHN_TOKEN_ADDRESS;
  return new web3.eth.Contract(JSON.parse(chnABI), chnAddress);
};

export const getValueStake = () => {
  const chnABI = STAKE_CONTRACT_ABI;
  const stakeContractAddress =
    enviroment === "prod"
      ? process.env.REACT_APP_STAKE_MAINNET_ADDRESS
      : process.env.REACT_APP_STAKE_TESTNET_ADDRESS;
  return new web3.eth.Contract(JSON.parse(chnABI), stakeContractAddress, {});
};
