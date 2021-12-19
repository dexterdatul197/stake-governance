import Web3 from 'web3';
import {
    MISSING_EXTENSION_ERROR,
    SoftwareWalletType,
    UninstallExtensionException
} from '../constant/uninstallExtentionException';
import {
    GOVERNENCE_RINKEBY_ABI,
    STRIKE_TOKEN_MAINNET_ABI,
    STRIKE_TOKEN_ROPSTEN_ABI
} from './../constant/constants';

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
  //TODO: need remove comment and last row
  // if (enviroment === 'prod') {
  //     return new web3.eth.Contract(JSON.parse(GOVERNENCE_MAINNET_ABI), process.env.REACT_APP_GOVERNANCE_MAIN_ADDRESS);
  // } else {
  //     return new web3.eth.Contract(JSON.parse(GOVERNENCE_RINKEBY_ABI), process.env.REACT_APP_GOVERNANCE_TESTNET_ADDRESS);
  // }
  
  return new web3.eth.Contract(
    JSON.parse(GOVERNENCE_RINKEBY_ABI),
    process.env.REACT_APP_GOVERNANCE_TESTNET_ADDRESS
  );
};

export const getCHNBalance = () => {
  if (enviroment === 'prod') {
    return new web3.eth.Contract(
      JSON.parse(STRIKE_TOKEN_MAINNET_ABI),
      process.env.REACT_APP_MAIN_CHN_TOKEN_ADDRESS
    );
  } else {
    return new web3.eth.Contract(
      JSON.parse(STRIKE_TOKEN_ROPSTEN_ABI),
      process.env.REACT_APP_TEST_CHN_TOKEN_ADDRESS
    );
  }
};
