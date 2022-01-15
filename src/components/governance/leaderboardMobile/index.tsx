import { Box, Paper } from '@material-ui/core';
import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { checkNotEmptyArr, format } from '../../../helpers/common';
import { getDataLeaderBoard } from '../../../apis/apis';
import { BigNumber } from '@0x/utils';
import { useHistory } from 'react-router-dom';

const cx = classNames.bind(styles);

const TableMobile = (props: any) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const getdataLeaderBoard = async () => {
      const dataLeaderBoard = await getDataLeaderBoard(page, limit);
      setData(dataLeaderBoard.data);
    };
    getdataLeaderBoard();
  }, []);

  const renderData = useCallback(
    (content, parentData) =>
      checkNotEmptyArr(content)
        ? content.map((item: any, index: any) => {
            const { id, address, voteWeight, proposalsVoted, chnStake } = item;
            const formatChnStake = new BigNumber(chnStake).div('1e18');
            return (
              <Box
                key={id}
                onClick={() =>
                  history.push(`/governance/leaderboard/leaderboard-detail/${address}`)
                }>
                <Box className={cx('txHash')}>
                  <span>{parentData + index + 1}</span>
                  <span>{address.substr(0, 19)}...</span>
                </Box>
                <Box className={cx('chn')}>
                  <span>CHN</span>
                  <span> {format(Number(formatChnStake))}</span>
                </Box>
                <Box className={cx('vote-weight')}>
                  <span>Vote Weight</span>
                  <span>{new BigNumber(voteWeight).multipliedBy(100).toFixed(4).toString()} %</span>
                </Box>
                <Box className={cx('proposal')}>
                  <span>Proposals Vote</span>
                  <span>{proposalsVoted}</span>
                </Box>
              </Box>
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
          {checkNotEmptyArr(data)
            ? data
                .sort((a: any, b: any) =>
                  new BigNumber(b.chnStake).minus(new BigNumber(a.chnStake)).toNumber()
                )
                .filter((item: any) => {
                  return item.chnStake !== '0';
                })
                .map((item, index) => {
                  const { id, address, voteWeight, proposalsVoted, chnStake } = item;
                  const content = [
                    {
                      id: id,
                      address: address,
                      chnStake: chnStake,
                      voteWeight: voteWeight,
                      proposalsVoted: proposalsVoted
                    }
                  ];
                  return (
                    <Box key={index} className={cx('children-content__main')}>
                      {renderData(content, index)}
                    </Box>
                  );
                })
            : null}
        </Box>
      </Paper>
    </Box>
  );
};

export default TableMobile;
