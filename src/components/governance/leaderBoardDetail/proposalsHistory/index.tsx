import { Box, LinearProgress } from '@material-ui/core';
import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const HistoryDetail = () => {
  return (
    <Box className={cx('history-content')}>
      <span className={cx('history-content__title')}>Proposal History</span>
      <Box className={cx('history-content__main')}>
        <Box className={cx('history-content__main__column_1')}>
          <span className={cx('title')}>Lorem Ipsum is simply dummy text of the printing </span>
          <Box className={cx('text')}>
            <span>1</span>
            <span>November 29, 2021</span>
            <span>Passed</span>
          </Box>
        </Box>
        <Box className={cx('history-content__main__column_2')}>
          <LinearProgress
            className={cx('progress-up')}
            variant="determinate"
            color="success"
            value={50}
          />
          <LinearProgress
            color="error"
            className={cx('progress-down')}
            variant="determinate"
            value={30}
          />
        </Box>
        <Box className={cx('history-content__main__column_3')}>up Vote </Box>
      </Box>
    </Box>
  );
};

export default HistoryDetail;
