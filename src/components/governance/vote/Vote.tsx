import { BigNumber } from '@0x/utils';
import { Button, CircularProgress } from '@mui/material';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getRank } from '../../../apis/apis';
import { currentAddress, commaFormat } from '../../../helpers/common';
import { isConnected } from '../../../helpers/connectWallet';
import { governance } from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import { setOpenCreateProposalDialog } from '../redux/Governance';
import styles from './Vote.module.scss';
import loadingSvg from 'src/assets/icon/loading.svg';

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
      const proposalThresholdRes = await contract.proposalThreshold();
      const proposalThreshold = ethers.utils.formatEther(proposalThresholdRes);
      const checkCHNamount = new BigNumber(votingWeight).comparedTo(proposalThreshold);
      // check user dont have any proposal with status active or pending
      const voteContract = await governance();
      const lastestProposalIdRes = await voteContract.latestProposalIds(connectedAddress);
      const lastestProposalId = lastestProposalIdRes.toString();

      if (lastestProposalId !== '0') {
        const stateRes = await voteContract.state(lastestProposalId);
        const state = stateRes.toString();
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
      if (checkCHNamount < 0) {
        dispatch(
          openSnackbar({
            message: `You can't create proposal.Your voting power should be ${commaFormat(
              new BigNumber(proposalThreshold)
            )} XCN at least`,
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
  }, [wallet.ethereumAddress, getRankApi, votingWeight]);
  return (
    <div className={cx('governance-vote')}>
      <div className={cx('vote-title')}>Vote Weight</div>
      <div className={cx('vote-content')}>
        <div className={cx('vote-value')}>
          <span className={cx('stake_value')}>{commaFormat(votingWeight)}</span>
          <span className={cx('stake_token')}>XCN</span>
        </div>
      </div>
      <Button onClick={handleOpenCreateForm} className={cx('create-proposal')}>
        {openLoading && (
          <img
          src={loadingSvg}
          className={cx('loading-rotate')}
          style={{ width: 18, margin: 0 }}
          alt=""
        />
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
