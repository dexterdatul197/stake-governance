import Item from 'antd/lib/list/Item';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTransactionHistory } from 'src/apis/apis';
import { FORMAT_DATE } from 'src/constant/constants';
import eventBus from 'src/event/event-bus';
import { sleep } from 'src/helpers/sleep';
import { SocketEvent } from 'src/socket/SocketEvent';
import { useAppSelector } from 'src/store/hooks';
import { Card } from './card';
import styles from './styles.module.scss';
import { ITransaction } from './transaction.slice';
import { setIsLoading } from 'src/components/balances/Table/transaction.slice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(styles);

const CardComponent: FC = () => {
  const wallet = useAppSelector((state) => state.wallet);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(20);
  const transactionData = useAppSelector((state) => state.transactions.transactions);
  const [hasMore, setHasMore] = useState(true);
  const isLoading = useAppSelector((state) => state.transactions.isLoading);
  const [filter, setFilter] = useState({
    page: 1,
    limit: limit,
    address: wallet.ethereumAddress,
    totalPage: 1
  });

  useEffect(() => {
    setFilter({
      page: 1,
      limit: limit,
      address: wallet.ethereumAddress,
      totalPage: 1
    });
  }, [limit, wallet.ethereumAddress]);

  useEffect(() => {
    dispatch(getTransactionHistory(filter));
    eventBus.on(SocketEvent.transactionUpdated, async () => {
      await sleep(1000);
    });
  }, []);
  useEffect(() => {
    dispatch(getTransactionHistory(filter));
  }, [filter]);

  const fetchData = () => {
    setTimeout(() => setLimit(limit + 20), 2000);
  };
  useEffect(() => {
    if (transactionData.data.length > 0) {
      if (transactionData.metadata.totalItem === transactionData.data.length) {
        dispatch(setIsLoading(false));
        setHasMore(false);
      }
    }
  }, [transactionData.data.length]);
  return (
    <>
      <div className={cx('card-container')}>
        <InfiniteScroll
          dataLength={transactionData.data.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={
            <h4 style={{ textAlign: 'center' }}>
              {isLoading ? <CircularProgress /> : 'No History Transaction'}
            </h4>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          refreshFunction={() => {}}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }>
          {transactionData.data.length > 0
            ? transactionData.data.map((item: ITransaction, index: number) => (
                <Card transaction={item} key={item.id} />
              ))
            : ''}
        </InfiniteScroll>
      </div>
    </>
  );
};
export default CardComponent;
