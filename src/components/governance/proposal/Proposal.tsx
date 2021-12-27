import { BigNumber } from '@0x/utils';
import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useEffect } from 'react';
import { currentAddress } from '../../../helpers/common';
import { getCHNBalance } from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import styles from './Proposal.module.scss';

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
  const currentAccount = useAppSelector((state) => state.wallet);
  // Get FREE CHN in Rinkeby
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const minForUser = async () => {
    //TODO: need remove, only apply in test
    if (currentAddress(currentAccount))
    await getCHNBalance().methods.mintForUser(new BigNumber('100000000000000000000')).send({from: currentAddress(currentAccount)});
    console.log('RECEIVE FREE CHN TOKEN');
    
  }
  useEffect(() => {
    minForUser();
  }, [currentAccount])
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
