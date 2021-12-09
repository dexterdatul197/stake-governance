import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@material-ui/system';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './Balances.module.scss';

const cx = classNames.bind(styles);

const useStyles: any = makeStyles(() => ({
  root: {
    // width: '50%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      marginTop: 0,
    },
    '& > .MuiOutlinedInput-root': {
      height: '2em',
      paddingRight: '25px'
    }
  },
  inputRoot: {
    background: 'rgba(114, 191, 101, 0.1);',
    height: '2em',
    paddingRight: '25px !important',
    '&.MuiOutlinedInput-root': {
      borderRadius: '18px',
    },
  },
  input: {
    textTransform: 'uppercase',
    color: '#72bf65 !important',
    width: '50px !important',
    paddingTop: '1px !important',
    paddingBottom: '0px !important'
  },
  endAdornment: {
    '& > .MuiAutocomplete-clearIndicator': {
      display: 'none',
    },
    '& > .MuiAutocomplete-popupIndicator': {
      color: '#72bf65',
    },
  },
}));

const paginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'rgba(255, 255, 255, 0.6);',
  },
  input: {
    '& > .MuiTablePagination-selectIcon': {
      color: 'rgba(255, 255, 255, 0.6);',
    },
  },
  actions: {
    '& > .Mui-disabled .MuiSvgIcon-fontSizeMedium': {
      color: 'rgba(255, 255, 255, 0.38);',
    },
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    backgroundColor: '#01163D',
    color: '#fff',
  },
  border: 0,
  padding: 15,
}));
const tableSortStyles = makeStyles(() => ({
  root: {
    '&:hover': {
      color: '#fff !important',
    },
    '&:focus': {
      color: '#fff !important',
    },
  },
}));

interface Data {
  id: number;
  transactionHash: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const Balances: React.FC = () => {
  type Order = 'asc' | 'desc';
  const classes = useStyles();
  const paginationClasses = paginationStyle();
  const tableSortClasses = tableSortStyles();
  const currencies = useAppSelector((state) => state.currency.currenciesList);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createData = (
    id: number,
    transactionHash: string,
    type: string,
    amount: string,
    date: string,
    status: string
  ) => {
    return { id, transactionHash, type, amount, date, status };
  };

  const rows = [
    createData(
      1,
      '0xxxxakhfkdhfwkh',
      'Stake',
      '$ 223 ',
      '15-11-2021',
      'Completed'
    ),
    createData(
      2,
      '0xxxxakhfksdfkh',
      'Withdraw',
      '$ 234 ',
      '27-11-2021',
      'pending'
    ),
    createData(
      3,
      '0xxxxakhfkasdfwkh',
      'Stake',
      '$ 554 ',
      '09-11-2021',
      'pending'
    ),
    createData(
      4,
      '0xxxxakhdaafwkh',
      'Claim',
      '$ 489 ',
      '15-11-2021',
      'pending'
    ),
    createData(
      5,
      '0xxxxakhfkasdfwkh',
      'Stake',
      '$ 543 ',
      '10-11-2021',
      'Withdraw'
    ),
    createData(
      6,
      '0xxxxakhfkadfkh',
      'Stake',
      '$ 543 ',
      '23-11-2021',
      'pending'
    ),
    createData(
      7,
      '0xxxxakhfkdhfwkgd',
      'Stake',
      '$ 223 ',
      '21-11-2021',
      'pending'
    ),
    createData(
      8,
      '0xxxxakhfkdhfwkh',
      'Stake',
      '$ 123 ',
      '20-11-2021',
      'Completed'
    ),
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'ID',
    },
    {
      id: 'transactionHash',
      numeric: true,
      disablePadding: false,
      label: 'Transaction Hash',
    },
    {
      id: 'type',
      numeric: true,
      disablePadding: false,
      label: 'Type',
    },
    {
      id: 'amount',
      numeric: true,
      disablePadding: false,
      label: 'Amount',
    },
    {
      id: 'date',
      numeric: true,
      disablePadding: false,
      label: 'Date',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
  ];

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
      a: { [key in Key]: number | string },
      b: { [key in Key]: number | string }
    ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
  ) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  return (
    <div className={cx('balances-history')}>
      <div className={cx('balance')}>
        <div className={cx('balance-head-text')}>Balances</div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Stake:</div>
          <div className={cx('balance-value')}>754.2</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div></div>
        </div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Wallet:</div>
          <div className={cx('balance-value')}>754.2</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div></div>
        </div>
        <div className={cx('balance-row')}>
          <div></div>
          <div className={cx('balance-key')}>Earned:</div>
          <div className={cx('balance-value')}>754.2</div>
          <div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              // onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div></div>
        </div>
        <div className={`${cx('switcher')} ${cx('switcher-1')}`}>
          <input className={cx('switcher_input')} type="checkbox" id="switcher-1" />
          <label className={cx('switcher_label')} htmlFor="switcher-1"></label>
        </div>
      </div>
      <div className={cx('history')}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <StyledTableCell
                      key={headCell.id}
                      align={'left'}
                      padding={headCell.disablePadding ? 'none' : 'normal'}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        // active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                        classes={tableSortClasses}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow tabIndex={-1} key={row.id}>
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          // scope="row"
                          align={'left'}
                        >
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align={'left'}>
                          {row.transactionHash}
                        </StyledTableCell>
                        <StyledTableCell align={'left'}>
                          {row.type}
                        </StyledTableCell>
                        <StyledTableCell align={'left'}>
                          {row.amount}
                        </StyledTableCell>
                        <StyledTableCell align={'left'}>
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align={'left'}>
                          {row.status}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <StyledTableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      classes={paginationClasses}
                    />
                  </StyledTableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};
export default Balances;
