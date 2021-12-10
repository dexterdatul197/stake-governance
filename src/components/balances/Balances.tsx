import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@material-ui/system';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './Balances.module.scss';
import TableComponent from './Table';

const cx = classNames.bind(styles);

const useStyles: any = makeStyles(() => ({
  root: {
    // width: '50%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      marginTop: 0,
    },
    '& > .MuiOutlinedInput-root': {
      height: '2em',
      paddingRight: '25px'
    }
  },
  inputRoot: {
    background: 'rgba(114, 191, 101, 0.1);',
    height: '2em',
    paddingRight: '25px !important',
    '&.MuiOutlinedInput-root': {
      borderRadius: '18px',
    },
  },
  input: {
    textTransform: 'uppercase',
    color: '#72bf65 !important',
    width: '50px !important',
    paddingTop: '1px !important',
    paddingBottom: '0px !important'
  },
  endAdornment: {
    '& > .MuiAutocomplete-clearIndicator': {
      display: 'none',
    },
    '& > .MuiAutocomplete-popupIndicator': {
      color: '#72bf65',
    },
  },
}));

const paginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'rgba(255, 255, 255, 0.6);',
  },
  input: {
    '& > .MuiTablePagination-selectIcon': {
      color: 'rgba(255, 255, 255, 0.6);',
    },
  },
  actions: {
    '& > .Mui-disabled .MuiSvgIcon-fontSizeMedium': {
      color: 'rgba(255, 255, 255, 0.38);',
    },
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    backgroundColor: '#01163D',
    color: '#fff',
  },
  border: 0,
  padding: 15,
}));
const tableSortStyles = makeStyles(() => ({
  root: {
    '&:hover': {
      color: '#fff !important',
    },
    '&:focus': {
      color: '#fff !important',
    },
  },
}));



const Balances: React.FC = () => {
  const classes = useStyles();
  const paginationClasses = paginationStyle();
  const tableSortClasses = tableSortStyles();
  const currencies = useAppSelector((state) => state.currency.currenciesList);


  return (
    <div className={cx('balances-history')}>
      <div className={cx('balance')}>
        <div className={cx('balance-head-text')}>Balances</div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Stake:</div>
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
        <div className={`${cx('switcher')} ${cx('switcher-1')}`}>
          <input className={cx('switcher_input')} type="checkbox" id="switcher-1" />
          <label className={cx('switcher_label')} htmlFor="switcher-1"></label>
        </div>
      </div>
      <div className={cx('history')}>
        <TableComponent />
      </div>
    </div>
  );
};
export default Balances;
