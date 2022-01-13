import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import classNames from 'classnames/bind';
import React from 'react';
import BackArrow from '../../back-arrow/BackArrow';
import styles from './styles.module.scss';
import { ReactComponent as AddressIcon } from '../../../assets/icon/icon-address.svg';
import { ReactComponent as UserIcon } from '../../../assets/icon/user.svg';
import ProposalHistory from './proposalsHistory';

const cx = classNames.bind(styles);
const data = Array.from(Array(5)).map((_) => ({
  action: 'Received CHN',
  time: '138 days ago',
  result: '600,000'
}));

const Detail = () => {
  return (
    <Box className={cx('details')}>
      <BackArrow title="Details" />
      <Box className={cx('main')}>
        <Box className={cx('main__address')}>
          <span>0xD5...7d35</span>
          <span>
            0xD578b88163b3c55bC8D87510695aD1f2E2607d35 <AddressIcon style={{ cursor: 'pointer' }} />
          </span>
        </Box>

        <Box className={cx('holding_transaction')}>
          <Box className={cx('holding')}>
            <span className={cx('holding__title')}>Holding</span>
            <Box className={cx('holding__balance')}>
              <span>Balance</span>
              <span>600</span>
            </Box>
            <Box className={cx('holding__chn')}>
              <Box className={cx('content-left')}>
                <span>CHN</span>
                <span>600,547.9349</span>
              </Box>
              <Box className={cx('content-right')}>
                <UserIcon />
                <span className={cx('number')}>89</span>
              </Box>
            </Box>
            <Box className={cx('holding__delegating')}>
              <span>Delegating To</span>
              <span>Undelegated</span>
            </Box>
          </Box>
          <Box className={cx('transaction')}>
            <span className={cx('title')}>Transactions</span>
            <Table className={cx('table')}>
              <TableHead className={cx('table__table-head')}>
                <TableRow className={cx('table-row')}>
                  <TableCell align="left" className={cx('table-row__table-cell')}>
                    Action
                  </TableCell>
                  <TableCell className={cx('table-row__table-cell')}>Time</TableCell>
                  <TableCell className={cx('table-row__table-cell')}>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('table__table-body')}>
                {data.map((item, index) => {
                  const { action, time, result } = item;
                  return (
                    <TableRow key={index} className={cx('table-row')}>
                      <TableCell className={cx('table-row__table-cell')}>{action}</TableCell>
                      <TableCell className={cx('table-row__table-cell')}>{time}</TableCell>
                      <TableCell className={cx('table-row__table-cell')}>{result}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <span className={cx('more')}>More</span>
          </Box>
        </Box>
        <ProposalHistory />
      </Box>
    </Box>
  );
};

export default Detail;
