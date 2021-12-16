import { Autocomplete, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React from 'react';
import { useDispatch } from 'react-redux';
import { isConnected } from '../../../helpers/connectWallet';
import { useAppSelector } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import { setOpenCreateProposalDialog } from '../redux/Governance';
import styles from './Vote.module.scss';

const useStyles: any = makeStyles(() => ({
  root: {
    // width: '50%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      marginTop: 0,
    },
    '& > .MuiOutlinedInput-root': {
      height: '2em',
      paddingRight: '25px',
    },
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
    paddingBottom: '0px !important',
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
const cx = classNames.bind(styles);

const Vote: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currencies = useAppSelector((state) => state.currency.currenciesList);
  const wallet = useAppSelector((state) => state.wallet);
  const handleOpenCreateForm = async () => {
    if (isConnected(wallet)) {
      const connectedAddress = Object.values(wallet).filter((item) => typeof(item) === 'string').filter(item => item.length > 0)[0];
      console.log('ADDRESS: ', connectedAddress);
      
      dispatch(setOpenCreateProposalDialog(true));
    } else {
      dispatch(openSnackbar({ variant: SnackbarVariant.ERROR, message: 'Need connect wallet to create proposal!' }));
    }
  }
  return (
    <div className={cx('governance-vote')}>
      <div className={cx('vote-title')}>Vote Weight</div>
      <div className={cx('vote-content')}>
        <div className={cx('vote-value')}>275</div>
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
      </div>
      <div className={cx('create-proposal')} onClick={handleOpenCreateForm}>Create Proposal</div>
      <div className={cx('border-bottom')}></div>
      <div className={cx('rank')}>Rank: 43</div>
      <div className={cx('view-leader-board')}>View leader board</div>
    </div>
  );
};
export default Vote;
