/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import BigNumber from 'bignumber.js';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTransactionHistory } from 'src/apis/apis';
import { ITransaction } from 'src/components/balances/Table/transaction.slice';
import eventBus from 'src/event/event-bus';
import { sleep } from 'src/helpers/sleep';
import { SocketEvent } from 'src/socket/SocketEvent';
import { useAppSelector } from 'src/store/hooks';
import arrowRightUp from '../../../assets/icon/arrow-right-up.svg';
import { FORMAT_DATE, headCells } from '../../../constant/constants';
import styles from './styles.module.scss';
const cx = classNames.bind(styles);

const TableComponent = () => {
  const dispatch = useDispatch();
  type Order = 'asc' | 'desc';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order] = useState<Order>('asc');
  const [orderBy] = useState('id');
  const transactionData = useAppSelector((state) => state.transactions.transactions);
  const wallet = useAppSelector((state) => state.wallet);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
    address: wallet.ethereumAddress
  });

  useEffect(() => {
    setFilter({
      page: page + 1,
      limit: rowsPerPage,
      address: wallet.ethereumAddress
    });
  }, [wallet.ethereumAddress]);

  useEffect(() => {
    eventBus.on(SocketEvent.transactionUpdated, async () => {
      await sleep(1000);
      if (page === 0) {
        dispatch(getTransactionHistory(filter));
      }
    });
  }, []);
  useEffect(() => {
    dispatch(getTransactionHistory(filter));
  }, [filter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setFilter({
      page: newPage + 1,
      limit: rowsPerPage,
      address: wallet.ethereumAddress
    });
  };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const getTypeTxt = (type: number) => {
    switch (type) {
      case 0:
        return 'Stake';
      case 1:
        return 'Withdraw';
      default:
        return 'Stake';
    }
  };

  const get_ellipsis_mid = (str: string) => {
    if (str && str.length > 15) {
      return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
    }
    return str;
  };

  return (
    <TableContainer className={cx('table-container')}>
      <Table className={cx('table')}>
        <TableHead className={cx('table-head')}>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
                className={cx('table-head__cell')}
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={cx('table-body')}>
          {transactionData.data.map((row: ITransaction, index: number) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <TableRow tabIndex={-1} key={row.id}>
                <TableCell
                  // component="th"
                  id={labelId}
                  // scope="row"
                  align={'left'}
                  className={cx('table-body__cell')}
                >
                  {row.id}
                </TableCell>
                <TableCell align={'left'} className={cx('table-body__cell')}>
                  <div className={cx('cell-hash')}>
                    <div className={cx('hash')}>{get_ellipsis_mid(row.tx_hash)}</div>
                    <img
                      className={cx('icon-redirect')}
                      onClick={() => {
                        window.open(`${process.env.REACT_APP_EXPLORER + row.tx_hash}`);
                      }}
                      src={arrowRightUp}
                      alt=""
                    />
                  </div>
                </TableCell>
                <TableCell align={'left'} className={cx('table-body__cell')}>
                  <div className={cx('txt-type')}>{getTypeTxt(row.type)}</div>
                </TableCell>
                <TableCell align={'left'} className={cx('table-body__cell')}>
                  <span>{Number(ethers.utils.formatEther(row.amount)).toFixed(4)}</span>
                  <span className={cx('txt-usd')}>
                    {' $' +
                      new BigNumber(ethers.utils.formatEther(row.amount))
                        .multipliedBy(row.price)
                        .toFixed(2)}
                  </span>
                  {/* {parseFloat(ethers.utils.formatEther((row.amount || '0') as string)).toFixed(4)} */}
                </TableCell>
                <TableCell align={'left'} className={cx('table-body__cell')}>
                  {moment(row.updated_at).format(FORMAT_DATE)}
                </TableCell>
                <TableCell align={'left'} className={cx('table-body__cell', 'completed')}>
                  Completed
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className={cx('footer-wrapper')}>
          <TableRow>
            <TableCell colSpan={6} className={cx('table-footer')}>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={transactionData.metadata.totalItem}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                // onRowsPerPageChange={handleChangeRowsPerPage}
                className={cx('table-pagination')}
                labelRowsPerPage="Items Per Page:"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
