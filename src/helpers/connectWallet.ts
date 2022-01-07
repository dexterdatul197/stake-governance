import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import axiosInstance from '../config/config';
import {
  MISSING_EXTENSION_ERROR,
  SoftwareWalletType,
  UninstallExtensionException
} from './../constant/uninstallExtentionException';
import { WalletData } from './../interfaces/WalletData';
const crypto = require('crypto');

// declare global {
//   interface Window {
//     ethereum?: any;
//     web3?: any;
//   }
// }

// CONNECT METAMASK
export const connectMetaMask = async (): Promise<string> => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    const accounts = window.web3.eth.getAccounts();
    return accounts[0];
  } else {
    const exception: UninstallExtensionException = {
      walletType: SoftwareWalletType.METAMASK,
      message: MISSING_EXTENSION_ERROR
    };
    throw exception;
  }
};

// Connect Trust wallet
export const connectTrust = async () => {
  // const connector = new WalletConnect({
  //   bridge: `${process.env.REACT_APP_TRUST_BRIDGE}`,
  //   qrcodeModal: QRCodeModal,
  // });
  // let accounts;
  // if (!connector.connected) {
  //   // create new session
  //   connector.createSession();
  // }
  // connector.on("connect", (error, payload) => {
  //   if (error) {
  //     console.log('CONNECT TRUST ERROR: ', error);
  //     const exception: UninstallExtensionException = {
  //       walletType: SoftwareWalletType.TRUST,
  //       message: MISSING_EXTENSION_ERROR,
  //     };
  //     throw exception;
  //   }
  //   // Get provided accounts and chainId
  //   accounts = payload.params[0].accounts;
  //   console.log('SERVICE: ', payload.params[0]);
  // });
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: `${process.env.REACT_APP_TRUST_BRIDGE}`
        },
        chainId: 56
      }
      // display: {
      //   name: "Mobile"
      // },
    }
  };
  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions // required
  });
  const provider = await web3Modal.connect();
  await web3Modal.toggleModal();
  // regular web3 provider methods
  const newWeb3 = new Web3(provider);
  const accounts = await newWeb3.eth.getAccounts();
  return accounts;
};

export const connectCoinbase = async (apiKey: string, apiSecret: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const req = {
    method: 'GET',
    path: '/v2/user',
    body: ''
  };
  const message = timestamp + req.method + req.path + req.body;
  const signature = crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
  const options = {
    headers: {
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-KEY': apiKey
    },
    baseUrl: process.env.REACT_APP_COIN_BASE_URL
  };
  let response: { code: number; data: any } = { code: 200, data: 'any' };
  await axiosInstance(options)
    .get('/v2/user')
    .then((res) => {
      response.code = 200;
      response.data = res.data;
    })
    .catch((err) => {
      if (err) {
        response.code = 401;
        response.data = 'Cannot connect Coinbase wallet!';
      }
    });
  return response;
};

export const isConnected = (wallet: WalletData): boolean => {
  return !!wallet.ethereumAddress;
};
