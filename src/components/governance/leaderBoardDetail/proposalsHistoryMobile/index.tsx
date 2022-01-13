import { Box } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { BigNumber } from '@0x/utils';

interface Props {
  BorderLinearProgress?: any;
  BorderLinearProgressDefeate?: any;
  dataDetail?: any;
  checkNotEmptyArr: any;
  moment: any;
  convertState: any;
}
const cx = classNames.bind(styles);

const MoBile = (props: Props) => {
  const {
    BorderLinearProgressDefeate,
    BorderLinearProgress,
    dataDetail,
    checkNotEmptyArr,
    moment,
    convertState
  } = props;
  const renderData = useCallback((content) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any, index: any) => {
          const { description, forVotes, againstVotes, createdAt, state, support, id } = item;
          const total = new BigNumber(parseInt(forVotes)).plus(
            new BigNumber(parseInt(againstVotes))
          );
          const percentForvote = new BigNumber(parseInt(forVotes) * 100).div(total).toString(10);

          const percentAgainstVotes = new BigNumber(parseInt(againstVotes) * 100)
            .div(total)
            .toString(10);
          return (
            <Box className={cx('mobile-content')} key={index}>
              <span className={cx('description')}>{description}</span>
              <Box className={cx('children-content')}>
                <Box className={cx('date-complete')}>
                  <span className={cx('date')}>
                    {id} {'  '} {moment(createdAt).format('MMMM Do, YYYY')}
                  </span>
                  <span className={cx(convertState(state))}>{convertState(state)}</span>
                </Box>
                <Box className={cx('progress-vote')}>
                  <Box className={cx('progress')}>
                    <BorderLinearProgress variant="determinate" value={Number(percentForvote)} />
                    <BorderLinearProgressDefeate
                      variant="determinate"
                      value={Number(percentAgainstVotes)}
                    />
                  </Box>
                  <Box className={cx('vote')}> {support === 1 ? 'Up Vote' : 'Down Vote'}</Box>
                </Box>
              </Box>
            </Box>
          );
        })
      : null;
  }, []);
  return (
    <React.Fragment>
      {checkNotEmptyArr(dataDetail)
        ? dataDetail.map((item: any, index: any) => {
            const { proposal, voter } = item;
            const { description, createdAt, state, forVotes, againstVotes, id } = proposal;
            const { support } = voter;
            const content = [
              {
                id: id,
                description: description,
                createdAt: createdAt,
                state: state,
                forVotes: forVotes,
                againstVotes: againstVotes,
                support: support
              }
            ];
            return <React.Fragment key={index}>{renderData(content)}</React.Fragment>;
          })
        : null}
    </React.Fragment>
  );
};

export default MoBile;
