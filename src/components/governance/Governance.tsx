import { BigNumber } from '@0x/utils';
import { CircularProgress } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { currentAddress, format } from '../../helpers/common';
import { isConnected } from '../../helpers/connectWallet';
import { getCHNBalance, stakingToken } from '../../helpers/ContractService';
import { useAppSelector } from '../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import ConnectWalletPage from '../connect-wallet-page/ConnectWalletPage';
import styles from './Governance.module.scss';
import Proposals from './proposals/Proposals';
import { setVotingWeight } from './redux/Governance';
import Vote from './vote/Vote';
const cx = classNames.bind(styles);
const Governance: React.FC = () => {
  const dispatch = useDispatch();
  const wallet = useAppSelector((state) => state.wallet);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getBalanceOf = async () => {
    if (isConnected(wallet)) {
      const connectedAddress = currentAddress(wallet);
      // const chnAmount = await getCHNBalance().methods.balanceOf(connectedAddress).call();
      const chnAmount = await stakingToken().methods.userInfo(0, connectedAddress).call();
      const formatValueStake =
        Math.floor(
          Number(
            String(new BigNumber(chnAmount.amount).dividedBy('1e18')).match(
              /^\d+(?:\.\d{0,5})?/
            )
          ) * 10000
        ) / 10000;
      dispatch(setVotingWeight(format(formatValueStake)));
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    getBalanceOf();
  }, [getBalanceOf]);
  return (
    <>
      {!wallet.ethereumAddress ? (
        <ConnectWalletPage />
      ) : (
        <div className={cx('governance')}>
          {isLoading ? (
            <div className={cx('loading-page')}>
              <CircularProgress
                size={50}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: '50%'
                }}
              />
            </div>
          ) : (
            <>
              <Vote />
              <Proposals />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Governance;
