import classNames from 'classnames/bind';
import styles from './Proposal.module.scss';
import React from 'react';
import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const cx = classNames.bind(styles);
const paginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'var(--pagination-color)',
  },
  input: {
    '& > .MuiTablePagination-selectIcon': {
      color: 'var(--pagination-action-color)',
    },
  },
  actions: {
    '& > .Mui-disabled .MuiSvgIcon-fontSizeMedium': {
      color: 'var(--pagination-action-color)',
    },
  },
}));

const Proposal: React.FC = () => {
  const paginationClasses = paginationStyle();
  const handleChangePage = () => { };
  return (
    <div className={cx('governance-proposal')}>
      <div className={cx('text-header')}>Proposal</div>
      <div className={cx('row-content')}>
          <div className={cx('row-content-left')}>
              <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, omnis.</div>
              <div>1 November 29, 2021</div>
          </div>
          <div className={cx('row-content-btn')}>
              <div></div>
              <div className={cx('vote')}>Voted</div>
          </div>
      </div>
      <div className={cx('row-content')}>
        <div className={cx('row-content-left')}>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ipsam maxime illum beatae vel, illo, et nobis doloremque numquam unde modi, blanditiis facere? Eaque, non voluptatem in rem possimus eius.</div>
          <div>1 November 29, 2021</div>
        </div>
        <div className={cx('row-content-btn')}>
          <div className={cx('btn-upvote')}>Up Vote</div>
          <div className={cx('btn-downvote')}>Down Vote</div>
        </div>
      </div>
      <div className={cx('row-content')}>
          <div className={cx('row-content-left')}>
              <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, omnis.</div>
              <div>1 November 29, 2021</div>
          </div>
          <div className={cx('row-content-btn')}>
              <div></div>
              <div className={cx('vote')}>Voted</div>
          </div>
      </div>
      <div className={cx('row-content')}>
        <div className={cx('row-content-left')}>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ipsam maxime illum beatae vel, illo, et nobis doloremque numquam unde modi, blanditiis facere? Eaque, non voluptatem in rem possimus eius.</div>
          <div>1 November 29, 2021</div>
        </div>
        <div className={cx('row-content-btn')}>
          <div className={cx('btn-upvote')}>Up Vote</div>
          <div className={cx('btn-downvote')}>Down Vote</div>
        </div>
      </div>
      <div className={cx('row-content')}>
          <div className={cx('row-content-left')}>
              <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, omnis.</div>
              <div>1 November 29, 2021</div>
          </div>
          <div className={cx('row-content-btn')}>
              <div></div>
              <div className={cx('vote')}>Voted</div>
          </div>
      </div>
      <div className={cx('row-content')}>
        <div className={cx('row-content-left')}>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ipsam maxime illum beatae vel, illo, et nobis doloremque numquam unde modi, blanditiis facere? Eaque, non voluptatem in rem possimus eius.</div>
          <div>1 November 29, 2021</div>
        </div>
        <div className={cx('row-content-btn')}>
          <div className={cx('btn-upvote')}>Up Vote</div>
          <div className={cx('btn-downvote')}>Down Vote</div>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={10}
        rowsPerPage={5}
        page={1}
        onPageChange={handleChangePage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
        classes={paginationClasses}
      />
    </div>
  );
};
export default Proposal;
