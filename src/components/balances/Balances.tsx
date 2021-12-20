import {
  Autocomplete,
  Button,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './Balances.module.scss';
import Modal from './Stake Modal';
import TableComponent from './Table';

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


const Balances: React.FC = () => {
  const classes = useStyles();
  const currencies = useAppSelector((state) => state.currency.currenciesList);
  const [active, setActive] = useState(false);
  const [activewithDraw, setActiveWithDraw] = useState(false);
  const [openStake, setOpenStake] = useState(false);

  const handleActiveClass = () => {
    setActive(!active);
    setActiveWithDraw(false);
    setOpenStake(true);
  }

  const handleCloseModal = () => {
    setOpenStake(false)
    setActive(false);
  }

  const handleActiveWithDraw = () => {
    setActiveWithDraw(!activewithDraw)
    setActive(false)
  }

  return (
    <div className={cx('balances-history')}>
      <div className={cx('balance')}>
        <div className={cx('balance-head-text')}>Balances</div>
        <div className={cx('balance-row')}>
          <div></div>
          <span className={cx('balance-key')}>Stake:</span>
          <span className={cx('balance-value')}>754.2</span>
          <Autocomplete
            classes={classes}
            options={currencies}
            defaultValue={'usd'}
            // onChange={handleOnChangeSelectCurrency}
            renderInput={(item) => (
              <TextField {...item} margin="normal" fullWidth />
            )}
            size={'small'}
            id="combo-box-demo"
          />
          <div></div>
        </div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Wallet:</div>
          <div className={cx('balance-value')}>754.2</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div></div>
        </div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Earned:</div>
          <div className={cx('balance-value')}>754.2</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div></div>
        </div>
        <div className={`${cx('switcher')}`}>
          <Button onClick={handleActiveClass} className={cx('switcher_stake', {
            'button-active': active,
            'button-deactive': !active
          })}>Stake</Button>
          <Button onClick={handleActiveWithDraw} className={cx('switcher_withdraw', {
            'button-active': activewithDraw,
            'button-deactive': !activewithDraw
          })}>WithDraw</Button>
        </div>
      </div>
      <div className={cx('history')}>
        <TableComponent />
      </div>

      <Modal currencies={currencies} classes={classes} openStake={openStake} handleCloseModal={handleCloseModal} />

    </div>
  );
};
export default Balances;
