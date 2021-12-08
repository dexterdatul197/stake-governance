import classnames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from '../connect-wallet/ConnectWallet';
import logo from './../../assets/imgs/logo.052a772b.png';
import style from './Header.module.scss';
const cx = classnames.bind(style);

const Header: React.FC = () => {
  const testRouter = () => {
      
  }
  return (
    <div className={cx('header-parent')}>
      <div className={cx('logo')}>
        <Link to="/" >
            <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={cx('stake-governance')}>
        <Link to="/stake" onClick={testRouter}>Stake</Link>
        <Link to="/governance">Governance</Link>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};
export default Header;
