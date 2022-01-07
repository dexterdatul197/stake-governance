import { Box, Button } from '@material-ui/core';
import { BigNumber } from '@0x/utils';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { currentAddress } from '../../helpers/common';
import { isConnected } from '../../helpers/connectWallet';
import { getCHNBalance, stakingToken } from '../../helpers/ContractService';
import useIsMobile from '../../hooks/useMobile';
import { useAppSelector } from '../../store/hooks';
import styles from './Balances.module.scss';
import Modal from './StakeModal';
import TableComponent from './Table';
import CardComponent from './TableOnMobile';
import ModalWithDraw from './WithDrawModal';
import ConnectWalletPage from '../connect-wallet-page/ConnectWalletPage';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

const initialState = {
  isActive: false,
  isActiveWithDraw: false,
  isOpenStake: false,
  isOpenWithdraw: false
};

const dataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'OPEN_STAKE':
      return {
        ...state,
        isOpenStake: true,
        isActive: true
      };
    case 'CLOSE_STAKE':
      return {
        ...state,
        isOpenStake: false,
        isActive: false
      };
    case 'OPEN_WITHDRAW':
      return {
        ...state,
        isActiveWithDraw: true,
        isOpenWithdraw: true
      };
    case 'CLOSE_WITHDRAW':
      return {
        ...state,
        isActiveWithDraw: false,
        isOpenWithdraw: false
      };
    default:
      return state;
  }
};

const Balances: React.FC = () => {
  const [state, dispatch] = useReducer(dataReducer, {
    isActive: false,
    isActiveWithDraw: false,
    isOpenStake: false,
    isOpenWithdraw: false
  });
  const isMobile = useIsMobile(768);

  const { isActive, isActiveWithDraw, isOpenStake, isOpenWithdraw } = state;
  const currencies = useAppSelector((state: any) => state.currency.currenciesList);
  const wallet = useAppSelector((state: any) => state.wallet);
  const [stake, setStake] = useState(0);
  const [walletValue, setWalletValue] = useState(0);
  const [earn, setEarn] = useState(0);
  const [updateSmartContract, setUpdateSmartContract] = useState(false);

  const handleActiveClass = () => {
    dispatch({ type: 'OPEN_STAKE' });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_STAKE' });
  };

  const handleActiveWithDraw = () => {
    dispatch({ type: 'OPEN_WITHDRAW' });
  };

  const handleCloseModalWithDraw = () => {
    dispatch({ type: 'CLOSE_WITHDRAW' });
  };

  const handleUpdateSmartContract = () => {
    setUpdateSmartContract((prevState) => !prevState);
  };

  const getValueBalance = useCallback(async () => {
    try {
      if (isConnected(wallet)) {
        const connectedAddress = currentAddress(wallet);
        const tokenBalance = await getCHNBalance().methods.balanceOf(connectedAddress).call();
        const formatToken = new BigNumber(tokenBalance).dividedBy('1e18').toFixed(4);
        setWalletValue(format(+formatToken));
      }
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  const getTotalStakeInPool = useCallback(async () => {
    try {
      const connectedAddress = currentAddress(wallet);
      const getValueStake = await stakingToken().methods.userInfo(0, connectedAddress).call();
      const getValueEarned = await stakingToken().methods.pendingReward(0, connectedAddress).call();
      const formatValueStake =
        Math.floor(
          Number(new BigNumber(getValueStake.amount).dividedBy('1e18')) * 1000000000000000000
        ) / 1000000000000000000;
      const formatValueEarned = new BigNumber(getValueEarned).dividedBy('1e18').toFixed(4);
      setStake(format(+formatValueStake));
      setEarn(format(+formatValueEarned));
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  useEffect(() => {
    getValueBalance();
  }, [getValueBalance, updateSmartContract]);

  useEffect(() => {
    getTotalStakeInPool();
  }, [getTotalStakeInPool, updateSmartContract]);

  return (
    <>
      {!wallet.ethereumAddress ? (
        <ConnectWalletPage />
      ) : (
        <Box className={cx('balances-history')}>
          <Box className={cx('balance')}>
            <Box className={cx('balance-head-text')}>Balances</Box>
            <Box className={cx('balance-row')}>
              <Box className={cx('stake')}>
                <span className={cx('stake__title')}>Stake:</span>
                <span className={cx('stake__value')}>{stake}</span>
                <span className={cx('stake__token')}>CHN</span>
              </Box>
              <Box className={cx('wallet')}>
                <span className={cx('wallet__title')}>Wallet:</span>
                <span className={cx('wallet__value')}>{walletValue}</span>
                <span className={cx('wallet__token')}>CHN</span>
              </Box>
              <Box className={cx('earn')}>
                <span className={cx('earn__title')}>Earned:</span>
                <span className={cx('earn__value')}>{earn}</span>
                <span className={cx('earn__token')}>CHN</span>
              </Box>
            </Box>

            <Box className={`${cx('switcher')}`}>
              <Button
                onClick={handleActiveClass}
                className={cx('switcher_stake', {
                  'button-active': isActive,
                  'button-deactive': !isActive
                })}>
                Stake
              </Button>
              <Button
                onClick={handleActiveWithDraw}
                className={cx('switcher_withdraw', {
                  'button-active': isActiveWithDraw,
                  'button-deactive': !isActiveWithDraw
                })}>
                WithDraw
              </Button>
            </Box>
          </Box>
          <div className={cx('history-label')}>History</div>
          <Box className={cx('history')}>
            <TableComponent />
          </Box>

          <Modal
            walletValue={walletValue}
            openStake={isOpenStake}
            handleCloseModal={handleCloseModal}
            handleUpdateSmartContract={handleUpdateSmartContract}
          />
          <ModalWithDraw
            stake={stake}
            earn={earn}
            openWithdraw={isOpenWithdraw}
            handleCloseModalWithDraw={handleCloseModalWithDraw}
            walletValue={walletValue}
            handleUpdateSmartContract={handleUpdateSmartContract}
          />
        </Box>
      )}
    </>
  );
};

export default Balances;
