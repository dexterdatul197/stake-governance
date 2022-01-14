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
import { checkNotEmptyArr, format } from '../../../helpers/common';
import LeaderBoardMobile from '../leaderboardMobile';
import useMobile from '../../../hooks/useMobile';
import { getDataLeaderBoard } from '../../../apis/apis';
import { BigNumber } from '@0x/utils';
import { useHistory } from 'react-router-dom';
const cx = classNames.bind(styles);

const LeaderBoard: React.FC = () => {
  const isMobile = useMobile(820);
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

<<<<<<< HEAD
  console.log(data);

  const renderData = useCallback((content, parentData) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any, index: any) => {
          const { id, address, voteWeight, proposals_voted, chnStake } = item;
          const formatChnStake = new BigNumber(chnStake).div('1e18');
=======
  const renderData = useCallback((content, parentData) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any, index: any) => {
          const { id, address, chn, vote_weight, proposals_voted } = item;
>>>>>>> a4c1a1f39c9a188c6bb1c283eeb9d1f224161863
          return (
            <React.Fragment key={id}>
              <TableCell className={cx('table-row__table-cell')}>
                {parentData + index + 1}
              </TableCell>
              <TableCell className={cx('table-row__table-cell')}>{address}</TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
<<<<<<< HEAD
                {format(Number(formatChnStake))}
=======
                {format(new BigNumber(chn).div(1e18).toFixed(4).toString())}
>>>>>>> a4c1a1f39c9a188c6bb1c283eeb9d1f224161863
              </TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {Number(new BigNumber(voteWeight).multipliedBy(100))} %
              </TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {proposals_voted}
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
                      CHN Stake
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
                  {checkNotEmptyArr(data)
                    ? data
                        .sort((a: any, b: any) =>
                          new BigNumber(b.chnStake).minus(new BigNumber(a.chnStake)).toNumber()
                        )
                        .map((item, index) => {
<<<<<<< HEAD
                          const { id, address, voteWeight, proposals_voted, chnStake } = item;
=======
                          const { id, address, votes, vote_weight, proposals_voted } = item;
>>>>>>> a4c1a1f39c9a188c6bb1c283eeb9d1f224161863
                          const content = [
                            {
                              id: id,
                              rank: index,
                              address: address,
<<<<<<< HEAD
                              chnStake: chnStake,
                              voteWeight: voteWeight,
=======
                              chn: votes,
                              vote_weight: vote_weight,
>>>>>>> a4c1a1f39c9a188c6bb1c283eeb9d1f224161863
                              proposals_voted: proposals_voted
                            }
                          ];
                          return (
                            <TableRow
                              onClick={() =>
                                history.push(
                                  `/governance/leaderboard/leaderboard-detail/${address}`
                                )
                              }
                              className={cx('table-row')}
                              key={index}
                            >
                              {renderData(content, index)}
                            </TableRow>
                          );
                        })
                    : null}
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
