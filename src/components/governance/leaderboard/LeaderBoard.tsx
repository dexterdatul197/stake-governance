import { BigNumber } from '@0x/utils';
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
import { useHistory } from 'react-router-dom';
import { getDataLeaderBoard } from '../../../apis/apis';
import { checkNotEmptyArr, format } from '../../../helpers/common';
import useMobile from '../../../hooks/useMobile';
import BackArrow from '../../back-arrow/BackArrow';
import LeaderBoardMobile from '../leaderboardMobile';
import styles from './LeaderBoard.module.scss';
const cx = classNames.bind(styles);

const LeaderBoard: React.FC = () => {
  const isMobile = useMobile(820);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getdataLeaderBoard = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      const dataLeaderBoard = await getDataLeaderBoard(page, limit);
      setData(dataLeaderBoard.data);
    };
    getdataLeaderBoard();
  }, []);

  const renderData = useCallback((content, parentData) => {
    return checkNotEmptyArr(content)
      ? content
          .filter((item: any) => {
            return item.chnStake !== '0';
          })
          .map((item: any, index: any) => {
            const { id, rank, address, voteWeight, proposalsVoted, chnStake } = item;
            const formatChnStake = new BigNumber(chnStake).div('1e18').toFixed(4).toString();
            return (
              <React.Fragment key={index}>
                <TableCell className={cx('table-row__table-cell')}>
                  {rank}
                </TableCell>
                <TableCell className={cx('table-row__table-cell')}>{address}</TableCell>
                <TableCell align="right" className={cx('table-row__table-cell')}>
                  {format(formatChnStake)}
                </TableCell>
                <TableCell align="right" className={cx('table-row__table-cell')}>
                  {new BigNumber(voteWeight).multipliedBy(100).toFixed(4).toString()} %
                </TableCell>
                <TableCell align="right" className={cx('table-row__table-cell')}>
                  {proposalsVoted}
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
                          new BigNumber(a.rank).minus(new BigNumber(b.rank)).toNumber()
                        )
                        .filter((item: any) => {
                          return item.chnStake !== '0';
                        })
                        .map((item, index) => {
                          const { id, rank, address, voteWeight, proposalsVoted, chnStake } = item;
                          const content = [
                            {
                              id: id,
                              address: address,
                              chnStake: chnStake,
                              voteWeight: voteWeight,
                              proposalsVoted: proposalsVoted,
                              rank: rank
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
                              key={index}>
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
