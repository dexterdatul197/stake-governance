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

  const renderData = useCallback((content, parentData) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any, index: any) => {
          const { id, address, voteWeight, proposalsVoted, chnStake } = item;
          const formatChnStake = new BigNumber(chnStake).div('1e18');
          return (
            <React.Fragment key={id}>
              <TableCell className={cx('table-row__table-cell')}>
                {parentData + index + 1}
              </TableCell>
              <TableCell className={cx('table-row__table-cell')}>{address}</TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {format(Number(formatChnStake))}
              </TableCell>
              <TableCell align="right" className={cx('table-row__table-cell')}>
                {Number(new BigNumber(voteWeight).multipliedBy(100))} %
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
                          new BigNumber(b.chnStake).minus(new BigNumber(a.chnStake)).toNumber()
                        )
                        .map((item, index) => {
                          const { id, address, voteWeight, proposalsVoted, chnStake } = item;
                          const content = [
                            {
                              id: id,
                              rank: index,
                              address: address,
                              chnStake: chnStake,
                              voteWeight: voteWeight,
                              proposalsVoted: proposalsVoted
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
