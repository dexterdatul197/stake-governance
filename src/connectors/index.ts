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
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    console.log('web3Provider', web3Provider);
    const signer = web3Provider.getSigner();
    return new ethers.Contract(address, abi, signer);
  }
  const provider = await CONNECTORS[walletName].getProvider();
  const web3Provider = await new providers.Web3Provider(provider);
  console.log('web3Provider', web3Provider);
  const signer = web3Provider.getSigner();

  return new ethers.Contract(address, abi, signer);
};
