import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useState } from 'react';
import BackArrow from '../../back-arrow/BackArrow';
import styles from './LeaderBoard.module.scss';
import { checkNotEmptyArr } from '../../../helpers/common';
import LeaderBoardMobile from '../leaderboardMobile';
import useMobile from '../../../hooks/useMobile';
import { getDataLeaderBoard } from '../../../apis/apis';
const cx = classNames.bind(styles);

const dataTable = [
  {
    rank: 1,
    txHash: '0xD578b88163b3c55bC8D87510695aD1f2E2607d35',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  },
  {
    rank: 2,
    txHash: '0xD578b88163b3c55bC8D87510695aD1f2E2607d35',
    chn: '292,097.25992705',
    voteWeight: '62.55%',
    proposalVote: 17
  }
];

const LeaderBoard: React.FC = () => {
  const isMobile = useMobile(820);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [data, setData] = useState({});

  useEffect(() => {
    const getdataLeaderBoard = async () => {
      const dataLeaderBoard = await getDataLeaderBoard(page, limit);
      setData(dataLeaderBoard.data);
    };
    getdataLeaderBoard();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const renderData = useCallback((content) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any) => {
          const { rank, txHash, proposalVote, chn, voteWeight } = item;
          return (
            <React.Fragment key={rank}>
              <TableCell className={cx('table-row__table-cell')}>{rank}</TableCell>
              <TableCell className={cx('table-row__table-cell')}>{txHash}</TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {chn}
              </TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {voteWeight}
              </TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {proposalVote}
              </TableCell>
            </React.Fragment>
          );
        })
      : null;
  }, []);

  return (
    <Box className={cx('leader-board')}>
      <BackArrow title="Leaderboard" />
      <Box className={cx('leader-board__chidlren')}>
        {isMobile ? (
          <LeaderBoardMobile />
        ) : (
          <Paper className={cx('content')}>
            <span>addresses by voting weight </span>
            <TableContainer className={cx('table-container')}>
              <Table className={cx('table')}>
                <TableHead className={cx('table-head')}>
                  <TableRow className={cx('table-row')}>
                    <TableCell className={cx('table-row__table-cell')}>Rank</TableCell>
                    <TableCell className={cx('table-row__table-cell')}></TableCell>
                    <TableCell align="right" className={cx('table-row__table-cell')}>
                      CHN
                    </TableCell>
                    <TableCell align="right" className={cx('table-row__table-cell')}>
                      VoteWeight
                    </TableCell>
                    <TableCell align="right" className={cx('table-row__table-cell')}>
                      Proposals Vote
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={cx('table-body')}>
                  {dataTable.map((item, index) => {
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
                      <TableRow className={cx('table-row')} key={rank}>
                        {renderData(content)}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
export default LeaderBoard;
