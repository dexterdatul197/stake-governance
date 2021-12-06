import React from "react";
import classnames from 'classnames/bind';
import style from './Header.module.scss';
import ConnectWallet from "../connect-wallet/ConnectWallet";
import logo from './../../assets/imgs/logo.052a772b.png';
const cx = classnames.bind(style);

const Header: React.FC = () => {
    return (
        <div className={cx('header-parent')}>
            <div className={cx('logo')}>
                <img src={logo} alt="logo" />
            </div>
            <div className={cx('stake-governance')}>
                <div>Stake</div>
                <div>Governance</div>
            </div>
            <div>
                <ConnectWallet />
            </div>
        </div>
    )
};
export default Header;