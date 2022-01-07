export const dec2hex = (number: string | number): string =>
  `0x${(+number).toString(16)}`;

export const switchNetwork = (
  chainId: string,
  fn?: (value: boolean) => void
): any => {
  const { ethereum } = window as any;
  try {
    return ethereum
      ?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: dec2hex(chainId) }],
      })
      .then(() => {
        if (fn) {
          fn(true);
        }
      })
      .catch(console.log);
  } catch (err: any) {
    console.error("switch network error", err);
  }
};
