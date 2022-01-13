import classNames from 'classnames/bind';
import { BigNumber } from 'ethers';
import React from 'react';
import { format } from 'src/helpers/common';
import { VoteData, VoteFormData } from 'src/interfaces/SFormData';
import Web3 from 'web3';
import styles from './VoteCard.module.scss';

const cx = classNames.bind(styles);
interface Props {
  props?: VoteFormData;
}

const get_ellipsis_mid = (str: string) => {
  if (str && str.length > 15) {
    return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
  }
  return str;
};

const formatCardNumber = (num: string) => {
  return format(Web3.utils.fromWei(num));
};
const VoteCard: React.FC<Props> = ({ props }) => {
  const sumVotes = formatCardNumber(props?.sumVotes as string);
  console.log('percent: ', props?.percent);
  return (
    <div className={cx('vote-card')}>
      <div className={cx('vote-card-title')}>
        <div>{props?.type}</div>
        <div>{sumVotes}</div>
      </div>
      <div
        className={cx('vote-card-progress')}
        style={{
          width: `${props?.percent}%`,
          backgroundColor:
            props?.type === 'Up Vote' ? 'rgba(114, 191, 101, 1)' : 'rgba(236, 86, 86, 1)'
        }}
      ></div>
      <div className={cx('vote-card-col')}>
        <div>{props?.votes.length || 0} addresses</div>
        <div>Vote</div>
      </div>
      {props?.votes.map((vote: VoteData, index: number) => {
        return (
          <div className={cx('vote-card-content')} key={index}>
            <div>{get_ellipsis_mid(vote?.address)}</div>
            <div className={cx('vote-card-content-vote')}>{formatCardNumber(vote?.votes)}</div>
          </div>
        );
      })}
    </div>
  );
};
export default VoteCard;
