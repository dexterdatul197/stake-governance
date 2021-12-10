import React, { useState, useCallback } from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    CircularProgress,
    Box
} from '@material-ui/core';
import classNames from 'classnames/bind';
import styles from './styles.module.scss'
import { rows, headCells } from '../../../constant/constants'
import { Typography } from '@mui/material';
const cx = classNames.bind(styles);



const TableComponent = () => {
    type Order = 'asc' | 'desc';
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState('id');



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
        <Paper className={cx('paper')}>
            <TableContainer className={cx('table-container')} >
                <Table className={cx('table')}>
                    <TableHead className={cx('table-head')}>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={'center'}
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
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow tabIndex={-1} key={row.id}>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            // scope="row"
                                            align={'center'}
                                            className={cx('table-body__cell')}
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align={'center'} className={cx('table-body__cell')}>
                                            {row.transactionHash}
                                        </TableCell>
                                        <TableCell align={'center'} className={cx('table-body__cell')}>
                                            {row.type}
                                        </TableCell>
                                        <TableCell align={'center'} className={cx('table-body__cell')}>
                                            {row.amount}
                                        </TableCell>
                                        <TableCell align={'center'} className={cx('table-body__cell')}>
                                            {row.date}
                                        </TableCell>
                                        <TableCell align={'center'} className={cx('table-body__cell', {
                                            'pending': row.status === 'pending',
                                            'completed': row.status === 'Completed'
                                        })}>
                                            {row.status}

                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className={cx('table-footer')}>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    className={cx('table-pagination')}
                                    labelRowsPerPage="Items Per Page:"
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default TableComponent
