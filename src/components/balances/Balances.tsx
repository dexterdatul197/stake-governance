import {
  Autocomplete,
  Button,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { currentAddress } from '../../helpers/common';
import { isConnected } from '../../helpers/connectWallet';
import { getCHNBalance, stakingToken } from '../../helpers/ContractService';
import { useAppSelector } from '../../store/hooks';
import styles from './Balances.module.scss';
import Modal from './StakeModal';
import TableComponent from './Table';
import ModalWithDraw from './WithDrawModal';
import { BigNumber } from '@0x/utils';




const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

const useStyles: any = makeStyles(() => ({
  root: {
    // width: '50%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      // marginTop: 0,
    },
    '& > .MuiOutlinedInput-root': {
      height: '2em',
      paddingRight: '25px'
    }
  },
  inputRoot: {
    background: 'var(--main-background-dropdow)',
    height: '2em',
    paddingRight: '25px !important',
    '&.MuiOutlinedInput-root': {
      borderRadius: '18px',
    },
  },
  input: {
    textTransform: 'uppercase',
    color: 'var(--btn-hover-blue-green) !important',
    width: '50px !important',
    paddingTop: '1px !important',
    paddingBottom: '0px !important'
  },
  endAdornment: {
    '& > .MuiAutocomplete-clearIndicator': {
      display: 'none',
    },
    '& > .MuiAutocomplete-popupIndicator': {
      color: 'var(--btn-hover-blue-green)',
    },
  },
}));

const initialState = {
  isActive: false,
  isActiveWithDraw: false,
  isOpenStake: false,
  isOpenWithdraw: false,
}

const dataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'OPEN_STAKE':
      return {
        ...state,
        isOpenStake: true,
        isActive: true,
      }
    case 'CLOSE_STAKE':
      return {
        ...state,
        isOpenStake: false,
        isActive: false,
      }
    case 'OPEN_WITHDRAW':
      return {
        ...state,
        isActiveWithDraw: true,
        isOpenWithdraw: true
      }
    case 'CLOSE_WITHDRAW':
      return {
        ...state,
        isActiveWithDraw: false,
        isOpenWithdraw: false
      }
    default:
      return state
  }
}


const Balances: React.FC = () => {
  const [state, dispatch] = useReducer(dataReducer, {
    isActive: false,
    isActiveWithDraw: false,
    isOpenStake: false,
    isOpenWithdraw: false,
  });
  const { isActive, isActiveWithDraw, isOpenStake, isOpenWithdraw } = state
  const classes = useStyles();
  const currencies = useAppSelector((state: any) => state.currency.currenciesList);
  const wallet = useAppSelector((state: any) => state.wallet);
  const [stake, setStake] = useState(0);
  const [walletValue, setWalletValue] = useState(0);
  const [earn, setEarn] = useState((0));
  const [updateSmartContract, setUpdateSmartContract] = useState(false)

  const handleActiveClass = () => {
    dispatch({ type: "OPEN_STAKE" })
  }

  const handleCloseModal = () => {
    dispatch({ type: "CLOSE_STAKE" });
  }

  const handleActiveWithDraw = () => {
    dispatch({ type: "OPEN_WITHDRAW" })
  }

  const handleCloseModalWithDraw = () => {
    dispatch({ type: "CLOSE_WITHDRAW" })
  }

  const handleUpdateSmartContract = () => {
    setUpdateSmartContract((prevState) => !prevState)
  }


  const getValueBalance = useCallback(async () => {
    try {
      if (isConnected(wallet)) {
        const connectedAddress = currentAddress(wallet);
        const tokenBalance = await getCHNBalance().methods.balanceOf(connectedAddress).call();
        const formatToken = new BigNumber(tokenBalance).dividedBy('1e18');
        setWalletValue(Math.floor(format(+formatToken)))

      }
    } catch (error) {
      console.log(error)
    }

  }, [wallet])

  const getTotalStakeInPool = useCallback(async () => {
    try {
      const connectedAddress = currentAddress(wallet);
      const getValueStake = await stakingToken().methods.userInfo(0, connectedAddress).call();
      const getValueEarned = await stakingToken().methods.pendingReward(0, connectedAddress).call()
      setStake(getValueStake.amount);
      setEarn(getValueEarned)
      // handleUpdateSmartContract()
      console.log(getValueStake)
    } catch (error) {
      console.log(error)
    }
  }, [wallet])

  useEffect(() => {
    getValueBalance()
  }, [getValueBalance])

  useEffect(() => {
    getTotalStakeInPool()
  }, [getTotalStakeInPool, updateSmartContract])



  return (
    <div className={cx('balances-history')}>
      <div className={cx('balance')}>
        <div className={cx('balance-head-text')}>Balances</div>
        <div className={cx('balance-row')}>
          <span className={cx('balance-key')}>Stake:</span>
          <span className={cx('balance-value')}>{stake}</span>
          <Autocomplete
            classes={classes}
            options={currencies}
            defaultValue={'chn'}
            // onChange={handleOnChangeSelectCurrency}
            renderInput={(item) => (
              <TextField {...item} margin="normal" fullWidth />
            )}
            size={'small'}
            id="combo-box-demo"
          />
        </div>
        <div className={cx('balance-row')}>
          <div className={cx('balance-key')}>Wallet:</div>
          <div className={cx('balance-value')}>{walletValue}</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'chn'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
        </div>
        <div className={cx('balance-row')}>
          <div className={cx('balance-key')}>Earned:</div>
          <div className={cx('balance-value')}>{earn}</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'chn'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
        </div>
        <div className={`${cx('switcher')}`}>
          <Button onClick={handleActiveClass} className={cx('switcher_stake', {
            'button-active': isActive,
            'button-deactive': !isActive
          })}>Stake</Button>
          <Button onClick={handleActiveWithDraw} className={cx('switcher_withdraw', {
            'button-active': isActiveWithDraw,
            'button-deactive': !isActiveWithDraw
          })}>WithDraw</Button>
        </div>
      </div>
      <div className={cx('history')}>
        <TableComponent />
      </div>

      <Modal walletValue={walletValue} currencies={currencies} classes={classes} openStake={isOpenStake} handleCloseModal={handleCloseModal} />
      <ModalWithDraw stake={stake} earn={earn} openWithdraw={isOpenWithdraw} handleCloseModalWithDraw={handleCloseModalWithDraw} walletValue={walletValue} />

    </div>
  );
};


export default Balances;
