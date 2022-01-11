import { TableContainer } from '@material-ui/core';
import classNames from 'classnames/bind';
import React from 'react';
import BackArrow from '../../back-arrow/BackArrow';
import styles from './LeaderBoard.module.scss';
const cx = classNames.bind(styles);

const LeaderBoard: React.FC = () => {
    return (
        <div className={cx('leader-board')}>
            <BackArrow title="Leaderboard" />
            <div>Table</div>
        </div>
    )
}
export default LeaderBoard;
