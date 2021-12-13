import classNames from 'classnames/bind';
import styles from './Vote.module.scss';
import React from 'react';
import { Autocomplete, TextField } from '@material-ui/core';
import { useAppSelector } from '../../../store/hooks';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { setOpenCreateProposalDialog } from '../redux/Governance';

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
  const handleOpenCreateForm = () => {
    dispatch(setOpenCreateProposalDialog(true));
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
