import { BigNumber } from '@0x/utils';
import { Box, TablePagination } from '@material-ui/core';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import classNames from 'classnames/bind';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { getDataLeaderBoardDetail } from 'src/apis/apis';
import { checkNotEmptyArr } from 'src/helpers/common';
import styles from './styles.module.scss';
import TableMobile from '../proposalsHistoryMobile';
import useMobile from '../../../../hooks/useMobile';
import { useHistory } from 'react-router-dom';

const cx = classNames.bind(styles);

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 13,
  marginBottom: '10px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === 'light' ? '#3EE046' : '#308fe8'
  }
}));

const BorderLinearProgressDefeate = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 13,
  marginBottom: '10px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === 'light' ? '#EC5656' : '#308fe8'
  }
}));

interface Props {
  address: any;
}

const HistoryDetail = (props: Props) => {
  const { address } = props;
  const [rowPerPage, setRowPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [dataDetail, setDataDetail] = useState([]);
  const [totalItem, setTotalItem] = useState();
  const [conditionFilter, setConditionFilter] = useState({
    page: 1,
    limit: 5
  });
  const isMobile = useMobile(844);
  const history = useHistory();

  useEffect(() => {
    const getDataDetail = async () => {
      const data = await getDataLeaderBoardDetail(
        address,
        conditionFilter.page,
        conditionFilter.limit
      );
      setTotalItem(data.metadata.totalItem);
      setDataDetail(data.data);
    };
    getDataDetail();
  }, [conditionFilter.page, conditionFilter.limit]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
    setConditionFilter({
      page: newPage + 1,
      limit: rowPerPage
    });
  };

  const convertState = (state: any) => {
    switch (state) {
      case 'Successded':
        return 'Successed';
      case 'Defeated':
        return 'Failed';
      case 'Active':
        return 'Active';
      case 'Canceled':
        return 'Canceled';
      case 'Pending':
        return 'Pending';
      case 'Queued':
        return 'Queued';
      case 'Expired':
        return 'Expired';
      case 'Executed':
        return 'Passed';
      default:
        break;
    }
  };

  const renderData = useCallback((content, parentData) => {
    return checkNotEmptyArr(content)
      ? content.map((item: any, index: any) => {
          const { title, forVotes, againstVotes, createdAt, state, support, id } = item;
          const total = new BigNumber(parseInt(forVotes)).plus(
            new BigNumber(parseInt(againstVotes))
          );
          const percentForvote = new BigNumber(parseInt(forVotes) * 100).div(total).toString(10);

          const percentAgainstVotes = new BigNumber(parseInt(againstVotes) * 100)
            .div(total)
            .toString(10);

          return (
            <React.Fragment key={id}>
              <Box className={cx('history-content__main__column_1')}>
                <span className={cx('title')}>{title ? title?.substr(0, 52): ''}...</span>
                <Box className={cx('text')}>
                  <span>{id}</span>
                  <span> {moment(createdAt).format('MMMM Do, YYYY')}</span>
                  <span className={cx(convertState(state))}>{convertState(state)}</span>
                </Box>
              </Box>
              <Box className={cx('history-content__main__column_2')}>
                <BorderLinearProgress variant="determinate" value={Number(percentForvote)} />
                <BorderLinearProgressDefeate
                  variant="determinate"
                  value={Number(percentAgainstVotes)}
                />
              </Box>
              <Box className={cx('history-content__main__column_3')}>
                {support === 1 ? 'Up Vote' : 'Down Vote'}
              </Box>
            </React.Fragment>
          );
        })
      : null;
  }, []);
  

  return (
    <Box className={cx('history-content')}>
      <span className={cx('history-content__title')}>Proposal History </span>
      {isMobile ? (
        <TableMobile
          BorderLinearProgress={BorderLinearProgress}
          BorderLinearProgressDefeate={BorderLinearProgressDefeate}
          dataDetail={dataDetail}
          checkNotEmptyArr={checkNotEmptyArr}
          moment={moment}
          convertState={convertState}
        />
      ) : checkNotEmptyArr(dataDetail) ? (
        dataDetail.map((item: any, index: any) => {
          const { proposal, voter } = item;
          const { title, createdAt, state, forVotes, againstVotes, id } = proposal;
          const { support } = voter;

          const content = [
            {
              id: id,
              title: title,
              createdAt: createdAt,
              state: state,
              forVotes: forVotes,
              againstVotes: againstVotes,
              support: support
            }
          ];
          return (
            <Box
              // onClick={() => history.push(history.push(`/proposal/${id}`))}
              className={cx('history-content__main')}
              key={id}>
              {renderData(content, index)}
            </Box>
          );
        })
      ) : null}

      <TablePagination
        component={'div'}
        rowsPerPageOptions={[]}
        rowsPerPage={rowPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        count={totalItem || 0}
        className={cx('table-pagination')}
      />
    </Box>
  );
};

export default HistoryDetail;
