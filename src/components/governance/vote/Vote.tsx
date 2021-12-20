import {
  Autocomplete,
  Backdrop,
  CircularProgress,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { isConnected } from '../../../helpers/connectWallet';
import {
  getCHNBalance,
  getVoteContract,
  governance
} from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import { setOpenCreateProposalDialog } from '../redux/Governance';
import styles from './Vote.module.scss';
import { BigNumber } from '@0x/utils';

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

  const [openLoading, setOpenLoading] = useState(false);
  const handleOpenCreateForm = async () => {
    if (isConnected(wallet)) {
      
      let createProposal = true;
      setOpenLoading(true);
      const connectedAddress = Object.values(wallet)
      .filter((item) => typeof item === 'string')
      .filter((item) => item.length > 0)[0];
      // check amount strike in wallet > proposalThreshold()
      const chnAmount = await getCHNBalance()
        .methods.balanceOf(connectedAddress)
        .call();
      const proposalThreshold = await governance()
        .methods.proposalThreshold()
        .call();
      const checkCHNamount = new BigNumber(chnAmount).comparedTo(new BigNumber(proposalThreshold));
      
      // check user dont have any proposal with status active or pending
      const voteContract = await governance();
      const lastestProposalId = await voteContract.methods.latestProposalIds(connectedAddress).call();
      console.log('PROPOSAL ID: ', lastestProposalId);
      
      
      setOpenLoading(false);
      if (checkCHNamount !== 1) {
        dispatch(openSnackbar({message: `You can't create proposal. Your voting power should be ${proposalThreshold} CHN at least`, variant: SnackbarVariant.ERROR}));
        createProposal = false;
        return;
      }
      
      if (createProposal) {
        dispatch(setOpenCreateProposalDialog(true));
      }
    } else {
      dispatch(
        openSnackbar({
          variant: SnackbarVariant.ERROR,
          message: 'Need connect wallet to create proposal!',
        })
      );
    }
  };
  const handleCloseLoading = () => {
    setOpenLoading(false);
  };
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
      <div className={cx('create-proposal')} onClick={handleOpenCreateForm}>
        Create Proposal
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoading}
        onClick={handleCloseLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={cx('border-bottom')}></div>
      <div className={cx('rank')}>Rank: 43</div>
      <div className={cx('view-leader-board')}>View leader board</div>
    </div>
  );
};
export default Vote;
