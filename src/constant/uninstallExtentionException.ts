export enum SoftwareWalletType {
  TRUST = 'Trust',
  METAMASK = 'MetaMask',
  COIN_BASE = 'CointBase',
  CONNECT_WALLET = 'ConnectWallet'
}

export const MISSING_EXTENSION_ERROR = 'Missing Extension';

export interface UninstallExtensionException {
  walletType: SoftwareWalletType;
  message: string;
}
