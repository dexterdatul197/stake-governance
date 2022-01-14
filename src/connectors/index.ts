import { providers, ethers } from 'ethers';
import { walletconnect } from './walletconnectConnector';
import { walletLinkConnector } from './walletlinkConnector';

interface IConnector {
  [key: string]: any;
  METAMASK: any;
  WALLET_CONNECT: any;
  COINBASE: any;
}

export const CONNECTORS: IConnector = {
  METAMASK: window.ethereum,
  WALLET_CONNECT: walletconnect,
  COINBASE: walletLinkConnector
};

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const createInstanceContract = async (address: string, abi: string) => {
  await sleep();
  const walletName = localStorage.getItem('walletName');
  if (!walletName) throw Error('No provider');

  if (walletName === 'METAMASK') {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
    return new ethers.Contract(address, abi, signer);
  }
  const connector = await CONNECTORS[walletName].getProvider();
  const provider = await new providers.Web3Provider(connector);
  const signer = provider.getSigner();

  return new ethers.Contract(address, abi, signer);
};
