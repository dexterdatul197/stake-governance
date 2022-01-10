import { ethers } from 'ethers';
import { FC } from 'react';
import { FORMAT_DATE } from 'src/constant/constants';
import moment from 'moment';
import { ITransaction } from './transaction.slice';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import arrowRightUp from '../../../assets/icon/arrow-right-up.svg';

const cx = classNames.bind(styles);

type CardProps = {
  transaction: ITransaction;
};

export const Card: FC<CardProps> = (props) => {
  const get_ellipsis_mid = (str: string) => {
    if (str && str.length > 15) {
      return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
    }
    return str;
  };
  const getTypeTxt = (type: number) => {
    switch (type) {
      case 0:
        return 'Stake';
      case 1:
        return 'Withdraw';
      default:
        return 'Stake';
    }
  };
  return (
    <div className={cx('card')}>
      <div className={cx('card-items')}>
        <div>{props.transaction.id}</div>
        <div className={cx('card-head-item')}>{get_ellipsis_mid(props.transaction.tx_hash)}</div>
        <img
          className={cx('icon-redirect')}
          onClick={() => {
            window.open(`${process.env.REACT_APP_EXPLORER + props.transaction.tx_hash}`);
          }}
          src={arrowRightUp}
          alt=""
        />
      </div>
      <div className={cx('card-items')}>
        <div>Type</div>
        <div className={cx('btn-stake')}>{getTypeTxt(props.transaction.type)}</div>
      </div>
      <div className={cx('card-items')}>
        <div>Amount</div>
        <div className={cx('card-items-2')}>
          {Number(ethers.utils.formatEther(props.transaction.amount)).toFixed(4)}
        </div>
      </div>
      <div className={cx('card-items')}>
        <div>Reward</div>
        <div className={cx('card-items-2')}>
          {props.transaction.type === 1
            ? Number(ethers.utils.formatEther(props.transaction.reward || 0)).toFixed(4)
            : '--'}
        </div>
      </div>
      <div className={cx('card-items')}>
        <div>Date</div>
        <div className={cx('card-items-2')}>
          {moment(props.transaction.updated_at).format(FORMAT_DATE)}
        </div>
      </div>
      <div className={cx('card-items')}>
        <div>Status</div>
        <div className={cx('card-items-2')} style={{ color: 'rgba(114, 191, 101, 1)' }}>
          Compeleted
        </div>
      </div>
    </div>
  );
};
