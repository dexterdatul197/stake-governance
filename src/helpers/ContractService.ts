import { ethers } from 'ethers';
import Web3 from 'web3';
import {
  MISSING_EXTENSION_ERROR,
  SoftwareWalletType,
  UninstallExtensionException
} from '../constant/uninstallExtentionException';
import {
  CHN_TOKEN_MAINNET_ABI,
  CHN_TOKEN_RINKEBY_ABI,
  GOVERNENCE_MAINNET_ABI,
  GOVERNENCE_RINKEBY_ABI,
  STAKING_RINKEBY_ABI
} from './../constant/constants';

import { createInstanceContract } from '../connectors/index';

const enviroment = process.env.REACT_APP_ENV;
export const checkInstallExtension = () => {
  if (!window.ethereum || !window.web3) {
    const exception: UninstallExtensionException = {
      walletType: SoftwareWalletType.METAMASK,
      message: MISSING_EXTENSION_ERROR
    };
    throw exception;
  }
};
export const governance = async () => {
  const governanceABI = enviroment === 'prod' ? GOVERNENCE_MAINNET_ABI : GOVERNENCE_RINKEBY_ABI;
  const governanceAddress =
    enviroment === 'prod'
      ? process.env.REACT_APP_GOVERNANCE_MAIN_ADDRESS
      : process.env.REACT_APP_GOVERNANCE_TESTNET_ADDRESS;
  return await createInstanceContract(governanceAddress as string, JSON.parse(governanceABI));
};

export const getCHNBalance = async () => {
  const chnABI = enviroment === 'prod' ? CHN_TOKEN_MAINNET_ABI : CHN_TOKEN_RINKEBY_ABI;
  const chnAddress =
    enviroment === 'prod'
      ? process.env.REACT_APP_MAIN_CHN_TOKEN_ADDRESS
      : process.env.REACT_APP_TEST_CHN_TOKEN_ADDRESS;

  return await createInstanceContract(chnAddress as string, JSON.parse(chnABI));
};

export const stakingToken = async () => {
  const stakeABI = STAKING_RINKEBY_ABI;
  const stakeAddress =
    enviroment === 'prod'
      ? process.env.REACT_APP_STAKE_TESTNET_ADDRESS
      : process.env.REACT_APP_STAKE_MAINNET_ADDRESS;

  return await createInstanceContract(stakeAddress as string, JSON.parse(stakeABI));
};

export const ethAddressPage = () => {
  return enviroment === 'prod'
    ? process.env.REACT_APP_ETHEREUM_MAIN_ADDRESS
    : process.env.REACT_APP_ETHEREUM_TESTNET_ADDRESS;
};

const call = (method: any, params: any) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .call()
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const send = (method: any, params: any, from: any) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .send({ from })
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const methods = {
  call,
  send
};
