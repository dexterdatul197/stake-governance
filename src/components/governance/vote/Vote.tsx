import { BigNumber } from '@0x/utils';
import { Button, CircularProgress } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getRank } from '../../../apis/apis';
import { currentAddress, format } from '../../../helpers/common';
import { isConnected } from '../../../helpers/connectWallet';
import { governance } from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import { setOpenCreateProposalDialog } from '../redux/Governance';
import styles from './Vote.module.scss';

const cx = classNames.bind(styles);
interface Props {
  voting?: string;
}

const Vote: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const wallet = useAppSelector((state) => state.wallet);
  const votingWeight = useAppSelector((state) => state.governance.voteingWeight);
  const [openLoading, setOpenLoading] = useState(false);
  const [rank, setRank] = useState('0');
  const handleOpenCreateForm = async () => {
    if (isConnected(wallet)) {
      let createProposal = true;
      setOpenLoading(true);
      const connectedAddress = currentAddress(wallet);
      // // check amount strike in wallet > proposalThreshold()
      const contract = await governance();
      const proposalThreshold = await contract.proposalThreshold();
      const checkCHNamount = new BigNumber(votingWeight).comparedTo(
        new BigNumber(proposalThreshold).div(1e18)
      );
      // check user dont have any proposal with status active or pending
      const voteContract = await governance();
      const lastestProposalId = await voteContract.methods.latestProposalIds(connectedAddress);
      //TODO:need remove comment to cancel lastestProposalId
      // const cancelLastestProposal = await voteContract.cancel(lastestProposalId).send({from: connectedAddress});
      // console.log('CANCEL PROPOSAL: ', cancelLastestProposal);

      if (lastestProposalId !== '0') {
        const state = await voteContract.state(lastestProposalId);
        if (state === '0' || state === '1') {
          setOpenLoading(false);
          createProposal = false;
          dispatch(
            openSnackbar({
              message: `You can't create proposal. there is a proposal in progress!`,
              variant: SnackbarVariant.ERROR
            })
          );
          return;
        } else {
          createProposal = true;
        }
      } else {
        // open popup
        createProposal = true;
      }
      setOpenLoading(false);
      if (checkCHNamount !== 1) {
        dispatch(
          openSnackbar({
            message: `You can't create proposal. Your voting power should be ${format(
              new BigNumber(proposalThreshold).div(1e18)
            )} CHN at least`,
            variant: SnackbarVariant.ERROR
          })
        );
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
          message: 'Need connect wallet to create proposal!'
        })
      );
    }
  };
  const handleRedirectToLeaderboard = () => {
    history.push(`/governance/leaderboard`);
  };

  const getRankApi = async () => {
    const rank = await getRank(currentAddress(wallet));
    setRank(rank.toString());
  };
  useEffect(() => {
    getRankApi();
  }, []);
  return (
    <div className={cx('governance-vote')}>
      <div className={cx('vote-title')}>Vote Weight</div>
      <div className={cx('vote-content')}>
        <div className={cx('vote-value')}>
          <span className={cx('stake_value')}>{format(votingWeight)}</span>
          <span className={cx('stake_token')}>CHN</span>
        </div>
      </div>
      <Button onClick={handleOpenCreateForm} className={cx('create-proposal')}>
        {openLoading && (
          <div>
            <CircularProgress size={20} color="inherit" />
            <span>Create Proposal</span>
          </div>
        )}
        {!openLoading && 'Create Proposal'}
      </Button>
      <div className={cx('border-bottom')}></div>
      <div className={cx('rank')}>
        <span className={cx('rank-title')}>Rank:</span>
        <span className={cx('rank-value')}>{rank}</span>
      </div>
      <div className={cx('view-leader-board')} onClick={handleRedirectToLeaderboard}>
        View leader board
      </div>
    </div>
  );
};
export default Vote;
