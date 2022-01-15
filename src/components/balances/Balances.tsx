import Web3 from 'web3';
import { Box, Button } from '@material-ui/core';
import { BigNumber } from '@0x/utils';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { currencyFormatter, currentAddress } from '../../helpers/common';
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
import { setVotingWeight } from '../governance/redux/Governance';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

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

  const { account, connector } = useWeb3React();

  const { isActive, isActiveWithDraw, isOpenStake, isOpenWithdraw } = state;
  const currencies = useAppSelector((state: any) => state.currency.currenciesList);
  const wallet = useAppSelector((state: any) => state.wallet);
  const [stake, setStake] = useState(0);
  const [walletValue, setWalletValue] = useState(0);
  const [earn, setEarn] = useState(0);
  const [updateSmartContract, setUpdateSmartContract] = useState(false);
  const [chnToken, setChntoken] = useState(0);

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
        const contract = await getCHNBalance();
        const tokenBalance = await contract.balanceOf(connectedAddress);
        const formatToken = ethers.utils.formatEther(tokenBalance);
        setChntoken(tokenBalance);
        setWalletValue(parseFloat(formatToken));
      }
    } catch (error) {
      console.log('getValueBalance', error);
    }
  }, [wallet, walletValue, connector]);

  const getTotalStakeInPool = useCallback(async () => {
    try {
      const connectedAddress = currentAddress(wallet);
      const contract = await stakingToken();
      const getValueStake = await contract.userInfo(0, connectedAddress);
      const getValueEarned = await contract.pendingReward(0, connectedAddress);

      const formatValueStake = ethers.utils.formatEther(getValueStake.amount)
      const formatValueEarned = ethers.utils.formatEther(getValueEarned)
      dispatch(setVotingWeight(formatValueStake));
      setStake(format(parseFloat(formatValueStake)));
      setEarn(format(parseFloat(formatValueEarned)));
    } catch (error) {
      console.log('getTotalStakeInPool', error);
    }
  }, [wallet, earn, stake]);

  useEffect(() => {
    getValueBalance();
  }, [getValueBalance, updateSmartContract, connector]);

  useEffect(() => {
    getTotalStakeInPool();
  }, [getTotalStakeInPool, updateSmartContract, connector]);

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
                <span className={cx('stake__value')}>{currencyFormatter(Number(stake))}</span>
                <span className={cx('stake__token')}>CHN</span>
              </Box>
              <Box className={cx('wallet')}>
                <span className={cx('wallet__title')}>Wallet:</span>
                <span className={cx('wallet__value')}>{currencyFormatter(Number(walletValue))}</span>
                <span className={cx('wallet__token')}>CHN</span>
              </Box>
              <Box className={cx('earn')}>
                <span className={cx('earn__title')}>Earned:</span>
                <span className={cx('earn__value')}>{currencyFormatter(Number(earn))}</span>
                <span className={cx('earn__token')}>CHN</span>
              </Box>
            </Box>

            <Box className={`${cx('switcher')}`}>
              <Button
                onClick={handleActiveClass}
                className={cx('switcher_stake', {
                  'button-active': isActive,
                  'button-deactive': !isActive
                })}
              >
                Stake
              </Button>
              <Button
                onClick={handleActiveWithDraw}
                className={cx('switcher_withdraw', {
                  'button-active': isActiveWithDraw,
                  'button-deactive': !isActiveWithDraw
                })}
              >
                WithDraw
              </Button>
            </Box>
          </Box>
          <div className={cx('history-label')}>History</div>
          {isMobile ? (
            <Box className={cx('history')}>
              <CardComponent />
            </Box>
          ) : (
            <Box className={cx('history')}>
              <TableComponent />
            </Box>
          )}
          <Modal
            walletValue={walletValue}
            openStake={isOpenStake}
            handleCloseModal={handleCloseModal}
            handleUpdateSmartContract={handleUpdateSmartContract}
            chnToken={chnToken}
          />
          <ModalWithDraw
            stake={stake}
            earn={earn}
            openWithdraw={isOpenWithdraw}
            handleCloseModalWithDraw={handleCloseModalWithDraw}
            handleUpdateSmartContract={handleUpdateSmartContract}
          />
        </Box>
      )}
    </>
  );
};

export default Balances;
