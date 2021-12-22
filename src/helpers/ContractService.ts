import Web3 from 'web3';
import {
  MISSING_EXTENSION_ERROR,
  SoftwareWalletType,
  UninstallExtensionException
} from '../constant/uninstallExtentionException';
import {
  CHN_TOKEN_MAINNET_ABI, CHN_TOKEN_RINKEBY_ABI, GOVERNENCE_RINKEBY_ABI, VOTE_CONTRACT_MAIN_ABI,
  VOTE_CONTRACT_ROPSTEN_ABI
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
  const chnABI = enviroment === 'prod' ? CHN_TOKEN_MAINNET_ABI : CHN_TOKEN_RINKEBY_ABI;
  const chnAddress = enviroment === 'prod' ? process.env.REACT_APP_MAIN_CHN_TOKEN_ADDRESS : process.env.REACT_APP_TEST_CHN_TOKEN_ADDRESS;
  return new web3.eth.Contract(JSON.parse(chnABI), chnAddress);
};

export const getVoteContract = () => {
  const voteContractABI = enviroment === 'prod' ? VOTE_CONTRACT_MAIN_ABI : VOTE_CONTRACT_ROPSTEN_ABI;
  const voteContractAddress = enviroment === 'prod' ? process.env.VOTE_CONTRACT_ROPSTEN_ADDRESS : process.env.VOTE_CONTRACT_MAIN_ADDRESS;
  return new web3.eth.Contract(JSON.parse(voteContractABI), voteContractAddress);
}
