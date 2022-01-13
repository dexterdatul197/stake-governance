import { Box, Paper } from '@material-ui/core';
import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { checkNotEmptyArr } from '../../../helpers/common';
import { getDataLeaderBoard } from '../../../apis/apis';
import { BigNumber } from '@0x/utils';
import { useHistory } from 'react-router-dom';

const cx = classNames.bind(styles);

const TableMobile = (props: any) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
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
    (content) =>
      checkNotEmptyArr(content)
        ? content.map((item: any, index: any) => {
            const { id, address, vote_weight, proposals_voted } = item;
            return (
              <Box
                key={index}
                onClick={() =>
                  history.push(`/governance/leaderboard/leaderboard-detail/${address}`)
                }>
                <Box className={cx('txHash')}>
                  <span>{index}</span>
                  <span>{address.substr(0, 19)}...</span>
                </Box>
                <Box className={cx('chn')}>
                  <span>CHN</span>
                  <span>{vote_weight}</span>
                </Box>
                <Box className={cx('vote-weight')}>
                  <span>Vote Weight</span>
                  <span>{Number(new BigNumber(vote_weight).multipliedBy(100))} %</span>
                </Box>
                <Box className={cx('proposal')}>
                  <span>Proposals Vote</span>
                  <span>{proposals_voted}</span>
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
                  Number(parseFloat(a.vote_weight) < parseFloat(b.vote_weight)) ? 1 : -1
                )
                .map((item, index) => {
                  const { id, address, vote_weight, proposals_voted } = item;
                  const content = [
                    {
                      id: id,
                      rank: index,
                      address: address,
                      chn: vote_weight,
                      vote_weight: vote_weight,
                      proposals_voted: proposals_voted
                    }
                  ];
                  return (
                    <Box key={index} className={cx('children-content__main')}>
                      {renderData(content)}
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
