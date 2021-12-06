import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import styles from './History.module.scss';

const cx = classNames.bind(styles);
const History: React.FC = () => {
    return (
        <div className={cx('history-table')}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Transaction Hash</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>ad8f76a7sfd</TableCell>
                        <TableCell>Stake</TableCell>
                        <TableCell>3000</TableCell>
                        <TableCell>2021-11-02 12:11:11</TableCell>
                        <TableCell>Pending</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>ad8f76a7sfd</TableCell>
                        <TableCell>Withdraw</TableCell>
                        <TableCell>3000</TableCell>
                        <TableCell>2021-11-02 12:11:11</TableCell>
                        <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>asdf87687a6f</TableCell>
                        <TableCell>Claim</TableCell>
                        <TableCell>3000</TableCell>
                        <TableCell>2021-11-02 12:11:11</TableCell>
                        <TableCell>Completed</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
export default History;