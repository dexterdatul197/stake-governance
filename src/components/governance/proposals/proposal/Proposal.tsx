import Icon from '@ant-design/icons/lib/components/Icon';
import { Button } from '@material-ui/core';
import classNames from 'classnames/bind';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { currentAddress, getStatus } from '../../../../helpers/common';
import { isConnected } from '../../../../helpers/connectWallet';
import { governance } from '../../../../helpers/ContractService';
import { ProposalFormData } from '../../../../interfaces/SFormData';
import { useAppSelector } from '../../../../store/hooks';
import styles from './Proposal.module.scss';

interface Props {
  proposal: ProposalFormData;
}
const cx = classNames.bind(styles);
const Proposal: React.FC<Props> = (props) => {
  const history = useHistory();
  const proposal: ProposalFormData = props.proposal;
  const wallet = useAppSelector((state) => state.wallet);
  const [voteStatus, setVoteStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voteType, setVoteType] = useState('like');
  const votingWeight = useAppSelector((state) => state.governance.voteingWeight);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getIshasVoted = async () => {
    if (isConnected(wallet)) {
      const contract = await governance();
      const receipt = contract.getReceipt(proposal.id, currentAddress(wallet));
      setVoteStatus(receipt.hasVoted ? 'voted' : 'novoted');
    }
  };

  const handleVote = async (support: string) => {
    setIsLoading(true);
    setVoteType(support);
    const contract = await governance();
    contract.castVote(props.proposal.id, support === 'like');
    setIsLoading(false);
  };

  const redirectToProposalDetail = (proposalId: number) => {
    history.push(`/proposal/${proposalId}`);
  };

  useEffect(() => {
    getIshasVoted();
  }, [getIshasVoted]);
  return (
    <div className={cx('proposal-item')} onClick={() => redirectToProposalDetail(proposal.id)}>
      <div className={cx('row-content-left')}>
        <div className={cx('proposal-title')}>{proposal.title}</div>
        <div className={cx('proposal-id-time')}>
          <div className={cx('proposal-id')}>{proposal.id}</div>
          <div className={cx('proposal-time')}>
            {moment(proposal.created_at).format('MMMM Do, YYYY')}
          </div>
          <div
            className={cx(
              `proposal-status-${getStatus(proposal.state).toLowerCase()}`,
              'proposal-status'
            )}>
            {getStatus(proposal.state)}
          </div>
        </div>
      </div>
      <div className={cx('row-content-right')}>
        <div className={cx('row-content-btn')}>
          {voteStatus && voteStatus === 'novoted' && proposal.state !== 'Active' && (
            <div
              className={cx('vote-status-text')}
              onClick={() => redirectToProposalDetail(proposal.id)}>
              NO VOTE
            </div>
          )}
          {voteStatus && voteStatus === 'voted' && (
            <div
              className={cx('vote-status-text')}
              onClick={() => redirectToProposalDetail(proposal.id)}>
              VOTED
            </div>
          )}
          {voteStatus && voteStatus === 'novoted' && proposal.state === 'Active' && (
            <div className={cx('flex-align-center')} onClick={(e) => e.stopPropagation()}>
              <Button
                className={cx('btn-upvote')}
                disabled={
                  votingWeight === '0' ||
                  !proposal ||
                  (proposal && proposal.state !== 'Active') ||
                  isLoading
                }
                onClick={() => handleVote('like')}>
                {isLoading && voteType === 'like' && <Icon type="loading" />} Up Vote
              </Button>
              <Button
                className={cx('btn-downvote')}
                disabled={
                  votingWeight === '0' ||
                  !proposal ||
                  (proposal && proposal.state !== 'Active') ||
                  isLoading
                }
                onClick={() => handleVote('dislike')}>
                {isLoading && voteType === 'dislike' && <Icon type="loading" />} Down Vote
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Proposal;
