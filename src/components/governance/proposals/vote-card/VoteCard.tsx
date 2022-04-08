import classNames from 'classnames/bind';
import { BigNumber } from 'ethers';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { commaFormat } from 'src/helpers/common';
import { VoteData, VoteFormData } from 'src/interfaces/SFormData';
import Web3 from 'web3';
import styles from './VoteCard.module.scss';

const cx = classNames.bind(styles);
interface Props {
  voting?: VoteFormData;
  parrentCallback: (childData: number) => void;
}

const get_ellipsis_mid = (str: string) => {
  if (str && str.length > 15) {
    return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
  }
  return str;
};

const formatCardNumber = (num: string) => {
  return commaFormat((+Web3.utils.fromWei(num)).toFixed(4));
};

const VoteCard: React.FC<Props> = ({ voting, parrentCallback }) => {
  const sumVotes = formatCardNumber(voting?.sumVotes as string);
  const history = useHistory();
  const noDataVoteLength = 4 - (voting?.votes.length || (0 as number));
  const noDataVote = [];
  if (noDataVoteLength > 0) {
    for (let i = 0; i < noDataVoteLength; i++) {
      noDataVote.push(
        <div className={cx('vote-card-content-none')} key={i}>
          <div>--</div>
          <div>--</div>
        </div>
      );
    }
  }
  const handleRedirectToLeaderboardDetail = (address: string) => {
    history.push(`/governance/leaderboard/leaderboard-detail/` + address);
  };
  return (
    <div className={cx('vote-card')}>
      <div className={cx('vote-card-title')}>
        <div>{voting?.type}</div>
        <div>{sumVotes}</div>
      </div>
      <div
        className={cx('vote-card-progress')}
        style={{
          width: `${voting?.percent}%`,
          backgroundColor:
            voting?.type === 'Up Vote' ? 'rgba(114, 191, 101, 1)' : 'rgba(236, 86, 86, 1)'
        }}
      ></div>
      <div className={cx('vote-card-col')}>
        <div>{voting?.votes.length || 0} addresses</div>
        <div>Vote</div>
      </div>
      {voting?.votes.map((vote: VoteData, index: number) => {
        return (
          <div className={cx('vote-card-content')} key={index}>
            <div
              className={cx('vote-card-content-address')}
              onClick={() => {
                handleRedirectToLeaderboardDetail(vote?.address);
              }}
            >
              {get_ellipsis_mid(vote?.address)}
            </div>
            <div className={cx('vote-card-content-vote')}>{formatCardNumber(vote?.votes)}</div>
          </div>
        );
      })}
      {noDataVoteLength > 0 && noDataVote}
      {voting?.votes.length !== voting?.totalVotes && (
        <div
          className={cx('vote-card-btn')}
          onClick={() => {
            parrentCallback(voting?.totalVotes || 0);
          }}
        >
          View All
        </div>
      )}
    </div>
  );
};
export default VoteCard;
