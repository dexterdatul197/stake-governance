import classnames from 'classnames/bind';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { isConnected } from '../../helpers/connectWallet';
import { useAppSelector } from '../../store/hooks';
import ConnectWallet from '../connect-wallet/ConnectWallet';
import { setOpenConnectDialog } from '../connect-wallet/redux/wallet';
import logo from './../../assets/imgs/logo.052a772b.png';
import style from './Header.module.scss';
const cx = classnames.bind(style);

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [stackBorder, setStackBorder] = useState(false);
  const [governanBorder, setGovernanceBorder] = useState(false);
  const testRouter = () => {
    setStackBorder(true);
    setGovernanceBorder(false);
  };
  const openDialogConnect = () => {
    setStackBorder(true);
    setGovernanceBorder(false);
    dispatch(setOpenConnectDialog(true));
  };

  const setGovernaneStyle = () => {
    setStackBorder(false);
    setGovernanceBorder(true);
  }

  const disableBorderStyle = () => {
    setStackBorder(false);
    setGovernanceBorder(false);
  }
  const wallet = useAppSelector((state) => state.wallet);
  return (
    <div className={cx('header-parent')}>
      <div className={cx('logo')}>
        <Link to="/" onClick={disableBorderStyle}>
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={cx('stake-governance')}>
        {isConnected(wallet) ? 
          <Link
            to="/stake"
            onClick={testRouter}
            className={stackBorder ? cx('link-style-border') : cx('link-style')}
          >
            Stake
          </Link> : 
          <Link 
            to="/" 
            onClick={openDialogConnect}
            className={cx('link-style')}
          >Stake</Link>
      }
        <Link
          to="/governance"
          onClick={setGovernaneStyle}
          className={governanBorder ? cx('link-style-border') : cx('link-style')}
        >
          Governance
        </Link>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};
export default Header;
