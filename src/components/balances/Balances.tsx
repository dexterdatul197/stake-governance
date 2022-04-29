import { Box, Button, CircularProgress } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import loadingSvg from 'src/assets/icon/loading.svg';
import Web3 from 'web3';
import { currencyFormatter, currentAddress } from '../../helpers/common';
import { isConnected } from '../../helpers/connectWallet';
import { claimContract, getCHNBalance, stakingToken } from '../../helpers/ContractService';
import useIsMobile from '../../hooks/useMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import ConnectWalletPage from '../connect-wallet-page/ConnectWalletPage';
import { setVotingWeight } from '../governance/redux/Governance';
import styles from './Balances.module.scss';
import Modal from './StakeModal';
import TableComponent from './Table';
import CardComponent from './TableOnMobile';
import ModalWithDraw from './WithDrawModal';

const web3 = new Web3();
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
  const dispatchSystem = useAppDispatch();
  const [state, dispatch] = useReducer(dataReducer, {
    isActive: false,
    isActiveWithDraw: false,
    isOpenStake: false,
    isOpenWithdraw: false
  });
  const isMobile = useIsMobile(844);

  const { account, connector } = useWeb3React();

  const { isActive, isActiveWithDraw, isOpenStake, isOpenWithdraw } = state;
  const currencies = useAppSelector((state: any) => state.currency.currenciesList);
  const wallet = useAppSelector((state: any) => state.wallet);
  const [stake, setStake] = useState(0);
  const [walletValue, setWalletValue] = useState(0);
  const [earn, setEarn] = useState(0);
  const [updateSmartContract, setUpdateSmartContract] = useState(false);
  const [chnToken, setChntoken] = useState(0);
  const [claimLoading, setClaimLoading] = useState(false);
  const [apy, setApy] = useState(0);
  const [progress, setProgress] = useState(false);
  const [disable, setDisable] = useState(false);
  const [spinner, setSpinner] = useState(false);
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

  const handleClaim = async () => {
    setClaimLoading(true);
    const contract = await claimContract();
    contract
      .claimReward(0)
      .then(async (res: any) => {
        await res.wait();
        const connectedAddress = currentAddress(wallet);
        const contract = await stakingToken();
        const getValueEarned = await contract.pendingReward(0, connectedAddress);
        const formatValueEarned = ethers.utils.formatEther(getValueEarned);
        setEarn(parseFloat(formatValueEarned));
        dispatchSystem(
          openSnackbar({ message: 'Claim success!', variant: SnackbarVariant.SUCCESS })
        );
        setClaimLoading(false);
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          dispatchSystem(
            openSnackbar({
              message: 'User denied transaction signature!',
              variant: SnackbarVariant.ERROR
            })
          );
        }
        setClaimLoading(false);
      });
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
      const formatValueStake = parseFloat(ethers.utils.formatEther(getValueStake.amount));
      const formatValueEarned = parseFloat(ethers.utils.formatEther(getValueEarned));
      dispatch(setVotingWeight(formatValueStake));
      setStake(formatValueStake);
      setEarn(formatValueEarned);
    } catch (error) {
      console.log('getTotalStakeInPool', error);
    }
  }, [wallet, earn, stake]);

  useEffect(() => {
    const getContract = async () => {
      try {
        const contract = await stakingToken();
        const connectedAddress = currentAddress(wallet);
        const getTotalStakedAmount = await contract.poolInfo(0);
        const getRewardPerBlock = await contract.rewardPerBlock();
        const formatTotalStaked = ethers.utils.formatEther(getTotalStakedAmount.totalAmountStake);
        const formatReward = ethers.utils.formatEther(getRewardPerBlock);
        const totalAPY =
          ((parseFloat(formatReward) * 6400 * 365) / parseFloat(formatTotalStaked)) * 100;
        setApy(totalAPY);
      } catch (error) {
        console.log('0.00013882438: ', error);
      }
    };
    getContract();
  }, [wallet, apy, updateSmartContract]);

  useEffect(() => {
    getValueBalance();
  }, [getValueBalance, updateSmartContract, connector]);

  useEffect(() => {
    getTotalStakeInPool();
  }, [getTotalStakeInPool, updateSmartContract, connector]);
  const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

  const handleConfirm = async () => {
    setDisable(true);
    try {
      const contract = await getCHNBalance();
      const handleConfirm = await contract.allowance(
        currentAddress(wallet),
        process.env.REACT_APP_STAKE_TESTNET_ADDRESS
      );
      if (handleConfirm._hex.toString() === '0x00') {
        await contract
          .approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, MAX_INT)
          .then(async (res: any) => {
            await res.wait();
            setProgress(true);
          })
          .catch((e: any) => console.log(e));
      } else {
        dispatch(
          openSnackbar({
            message: 'Please wait a moment',
            variant: SnackbarVariant.SUCCESS
          })
        );
      }
    } catch (error: any) {
      console.log({ error });
      if (error.code === '4001' || error.message) {
        setDisable(false);
      }
    }finally{
      setDisable(false)
    }
  };
  const handleCheckAllow = async () => {
    setDisable(true);
    try {
      const contract = await getCHNBalance();
      await contract
        .allowance(currentAddress(wallet), process.env.REACT_APP_STAKE_TESTNET_ADDRESS)
        .then((res: any) => {
          if (res._hex.toString() !== '0x00') {
            setDisable(true);
            setProgress(true);
          } else {
            setDisable(false);
            setProgress(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleCheckAllow();
  }, [wallet]);
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
                <span className={cx('stake__token')}>XCN</span>
              </Box>
              <Box className={cx('wallet')}>
                <span className={cx('wallet__title')}>Wallet:</span>
                <span className={cx('wallet__value')}>
                  {currencyFormatter(Number(walletValue))}
                </span>
                <span className={cx('wallet__token')}>XCN</span>
              </Box>
              <Box className={cx('earn')}>
                <span className={cx('earn__title')}>Earned:</span>
                <span className={cx('earn__value')}>{currencyFormatter(Number(earn))}</span>
                <span className={cx('earn__token')}>XCN</span>
              </Box>
              <Box className={cx('apy')}>
                <span className={cx('apy__title')}>APR:</span>
                <span title={apy.toString() + '%'} className={cx('apy__value')}>
                  {apy ? apy.toFixed(4).toString() : 0}%
                </span>
                <span className={cx('apy__percent')}></span>
              </Box>
            </Box>

            <Box className={`${cx('switcher')}`}>
              {progress ? (
                <Button
                  disabled={walletValue === 0.0}
                  onClick={handleActiveClass}
                  className={cx('switcher_stake', {
                    'button-active': isActive,
                    'button-deactive': !isActive
                  })}>
                  {spinner ? <CircularProgress size={20} style={{ color: '#fff' }} /> : 'Stake'}
                </Button>
              ) : (
                <Button
                  disabled={disable}
                  onClick={handleConfirm}
                  className={cx('switcher_stake', {
                    'button-active': isActive,
                    'button-deactive': !isActive
                  })}>
                  {disable ? <CircularProgress size={20} style={{ color: '#fff' }} /> : 'Approve'}
                </Button>
              )}

              <Button
                disabled={stake === 0.0}
                onClick={handleActiveWithDraw}
                className={cx('switcher_withdraw', {
                  'button-active': isActiveWithDraw,
                  'button-deactive': !isActiveWithDraw
                })}>
                WithDraw
              </Button>
            </Box>
            <Box className={cx('btn-claim')}>
              <Button
                className={cx('switcher_claim')}
                onClick={handleClaim}
                disabled={claimLoading || earn === 0.0}>
                {claimLoading ? (
                  <img
                    src={loadingSvg}
                    className={cx('loading-rotate')}
                    style={{ width: 18, margin: 0 }}
                    alt=""
                  />
                ) : (
                  'Claim'
                )}
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
            walletValue={walletValue}
          />
        </Box>
      )}
    </>
  );
};

export default Balances;
