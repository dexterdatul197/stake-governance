import { Box, Paper } from '@material-ui/core';
import React, { useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { checkNotEmptyArr } from '../../../helpers/common';
import { check } from 'prettier';
import { AddBoxSharp } from '@mui/icons-material';

const cx = classNames.bind(styles);

const dataTable = [
  {
    rank: 1,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 2,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 3,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 4,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 5,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 6,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 7,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 8,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 9,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 10,
    txHash: '0xD578b88163b3c55bC8D87510695...',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  }
];

const TableMobile = () => {
  const renderData = useCallback(
    (content) =>
      checkNotEmptyArr(content)
        ? content.map((item: any) => {
            const { rank, txHash, chn, voteWeight, proposalVote } = item;
            return (
              <React.Fragment key={rank}>
                <Box className={cx('txHash')}>
                  <span>{rank}</span>
                  <span>{txHash}</span>
                </Box>
                <Box className={cx('chn')}>
                  <span>CHN</span>
                  <span>{chn}</span>
                </Box>
                <Box className={cx('vote-weight')}>
                  <span>Vote Weight</span>
                  <span>{voteWeight}</span>
                </Box>
                <Box className={cx('proposal')}>
                  <span>Proposals Vote</span>
                  <span>{proposalVote}</span>
                </Box>
              </React.Fragment>
            );
          })
        : null,
    []
  );
  return (
    <Box className={cx('table')}>
      <Paper className={cx('paper')}>
        <span className={cx('title')}>addresses by voting weight </span>
        <Box className={cx('children-content')}>
          <span className={cx('children-content__rank')}>Rank</span>
          {dataTable.map((item) => {
            const { rank, txHash, chn, voteWeight, proposalVote } = item;
            const content = [
              {
                rank: rank,
                txHash: txHash,
                chn: chn,
                voteWeight: voteWeight,
                proposalVote: proposalVote
              }
            ];
            return (
              <Box key={rank} className={cx('children-content__main')}>
                {renderData(content)}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default TableMobile;
