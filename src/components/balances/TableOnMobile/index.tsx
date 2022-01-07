import classNames from 'classnames/bind';
import { FC } from 'react';
import styles from './styles.module.scss';


const cx = classNames.bind(styles);

const CardComponent : FC = () => {
    const Card = () => {
        return (
            <div className={cx('card')}>
                    <div className={cx('card-items')}>
                        <div>1</div>
                        <div className={cx('card-head-item')}>0xxxxakhfkdhfwkh...</div>
                    </div>
                    <div className={cx('card-items')}>
                        <div>Type</div>
                        <div className={cx('btn-stake')}>Stake</div>
                    </div>
                    <div className={cx('card-items')}>
                        <div>Amount</div>
                        <div className={cx('card-items-2')}>489$</div>
                    </div>
                    <div className={cx('card-items')}>
                        <div>Date</div>
                        <div className={cx('card-items-2')}>22-11-2021</div>
                    </div>
                    <div className={cx('card-items')}>
                        <div>Status</div>
                        <div className={cx('card-items-2')} style={{color: 'rgba(16, 125, 239, 1)', fontWeight: '700' }}>Pending</div>
                    </div>
                </div>
        )
    }
    return (
        <>
            <div className={cx('card-container')}>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </>
    )
}

export default CardComponent
