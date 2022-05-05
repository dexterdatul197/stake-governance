import { injectedConnector } from './injectedConnector';
import { providers, ethers } from 'ethers';
import { walletconnect } from './walletconnectConnector';
import { walletLinkConnector } from './walletlinkConnector';

interface IConnector {
  [key: string]: any;
  METAMASK: any;
  WALLET_CONNECT: any;
  COINBASE: any;
  TRUST:any
}

export const CONNECTORS: IConnector = {
  METAMASK: injectedConnector,
  TRUST:injectedConnector,
  WALLET_CONNECT: walletconnect,
  COINBASE: walletLinkConnector
};

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const createInstanceContract = async (address: string, abi: string) => {
  await sleep();
  const walletName = localStorage.getItem('walletName');
  if (!walletName) throw Error('No provider');
  const provider = await CONNECTORS[walletName].getProvider();
  const web3Provider = await new providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();

  return new ethers.Contract(address, abi, signer);
};
