import { BigNumber } from '@0x/utils';
import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProposalList } from '../../../apis/apis';
import { currentAddress } from '../../../helpers/common';
import { getCHNBalance } from '../../../helpers/ContractService';
import { Filter } from '../../../interfaces/SFormData';
import { useAppSelector } from '../../../store/hooks';
import Proposal from './proposal/Proposal';
import styles from './Proposals.module.scss';

const cx = classNames.bind(styles);
const paginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'var(--pagination-color)'
  },
  input: {
    '& > .MuiTablePagination-selectIcon': {
      color: 'var(--pagination-action-color)'
    }
  },
  actions: {
    '& > .Mui-disabled .MuiSvgIcon-fontSizeMedium': {
      color: 'var(--pagination-action-color)'
    }
  }
}));

const Proposals: React.FC = () => {
  const dispatch = useDispatch();
  const paginationClasses = paginationStyle();

  const currentAccount = useAppSelector((state) => state.wallet);
  const proposals = useAppSelector((state) => state.proposals.proposals);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [conditionFilter, setConditionFilter] = useState<Filter>({
    page: 1,
    limit: 5
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
    setConditionFilter({
      page: newPage + 1,
      limit: rowPerPage
    });
  };

  const minForUser = async () => {
    // TODO: need remove, only apply in test
    // if (currentAddress(currentAccount))
    // await getCHNBalance().methods.mintForUser(new BigNumber('100000000000000000000')).send({from: currentAddress(currentAccount)});
    // console.log('RECEIVE FREE CHN TOKEN');
  };

  useEffect(() => {
    minForUser();
    dispatch(getProposalList(conditionFilter));
  }, [conditionFilter.limit, conditionFilter.page, currentAccount, dispatch]);

  return (
    <div className={cx('governance-proposal')}>
      <div className={cx('text-header')}>Proposal</div>
      {proposals && proposals.data.length !== 0 ? (
        proposals.data.map((item, key) => {
          return <Proposal proposal={item} key={key} />;
        })
      ) : (
        <div className={cx('no-proposal')}>No Proposals</div>
      )}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={proposals.metadata.totalItem || 0}
        rowsPerPage={rowPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        classes={paginationClasses}
      />
    </div>
  );
};
export default Proposals;
