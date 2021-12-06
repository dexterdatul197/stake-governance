import React from "react";
import classNames from 'classnames/bind';
import styles from './Balances.module.scss';

const cx = classNames.bind(styles);
const Balances: React.FC = () => {
    return (
        <div className={cx('balances')}>
            <h3>Balances</h3>
            <div>Staked: 754.2 <span>CHN</span></div>
            <div>Wallet: 275 <span>CHN</span></div>
            <div>Earned: 47 <span>CHN</span></div>
            <div>
                <button className={cx('btn-button', 'btn-stake')}>Stake</button>
                <button className={cx('btn-button', 'btn-withdraw')}>WithDraw</button>
            </div>
        </div>
    )
}
export default Balances;