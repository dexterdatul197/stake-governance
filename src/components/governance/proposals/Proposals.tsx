import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProposalList } from '../../../apis/apis';
import eventBus from '../../../event/event-bus';
import { sleep } from '../../../helpers/sleep';
import useIsMobile from '../../../hooks/useMobile';
import { Filter } from '../../../interfaces/SFormData';
import { SocketEvent } from '../../../socket/SocketEvent';
import { useAppSelector } from '../../../store/hooks';
import Proposal from './proposal/Proposal';
import styles from './Proposals.module.scss';

const cx = classNames.bind(styles);
const paginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'var(--pagination-color)',
    position: 'absolute',
    bottom: '10px',
    right: '10px'
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

const mobilePaginationStyle = makeStyles(() => ({
  toolbar: {
    color: 'var(--pagination-color)',
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
  const mobilePaginationClasses = mobilePaginationStyle();
  const currentAccount = useAppSelector((state) => state.wallet);
  const proposals = useAppSelector((state) => state.proposals.proposals);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [conditionFilter, setConditionFilter] = useState<Filter>({
    page: 1,
    limit: 5
  });
  const isMobile = useIsMobile(844);

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
    setConditionFilter({
      page: newPage + 1,
      limit: rowPerPage
    });
  };

  useEffect(() => {
    dispatch(getProposalList(conditionFilter));
  }, [conditionFilter.limit, conditionFilter.page, currentAccount, dispatch]);

  useEffect(() => {
    eventBus.on(SocketEvent.updateProposal, async (data: any) => {
      await sleep(1000);
    });
  }, []);

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
        classes={isMobile || proposals.data.length !== 0 ? mobilePaginationClasses : paginationClasses}
      />
    </div>
  );
};
export default Proposals;
