import classnames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { THEME_MODE } from '../../constant/constants';
import { isConnected } from '../../helpers/connectWallet';
import { useAppSelector } from '../../store/hooks';
import { setTheme } from '../../store/theme';
import ConnectWallet from '../connect-wallet/ConnectWallet';
import { setEthereumAddress, setOpenConnectDialog } from '../connect-wallet/redux/wallet';
import dark_whiteIcon from './../../assets/icon/dark-white.svg';
import darkIcon from './../../assets/icon/dark.svg';
import light_whiteIcon from './../../assets/icon/light-white.svg';
import lightIcon from './../../assets/icon/light.svg';
import logo from './../../assets/icon/CHN_dark_logo.png';
import dark_logo from './../../assets/icon/CHN_light_logo.png';
import style from './Header.module.scss';
import useIsMobile from '../../hooks/useMobile';
const cx = classnames.bind(style);

const Header: React.FC = () => {
  const { account } = useWeb3React<Web3>();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentLocation = location.pathname.split('/');

  const [stackBorder, setStackBorder] = useState(false);
  const [governanBorder, setGovernanceBorder] = useState(false);

  useEffect(() => {
    if (currentLocation[1] === 'stake') {
      setStackBorder(true);
      setGovernanceBorder(false);
    } else if (currentLocation[1] === 'governance') {
      setStackBorder(false);
      setGovernanceBorder(true);
    } else {
      setStackBorder(false);
      setGovernanceBorder(false);
    }
  }, [currentLocation]);

  const testRouter = () => {
    setStackBorder(true);
    setGovernanceBorder(false);
  };
  const openDialogConnect = () => {
    setStackBorder(true);
    setGovernanceBorder(false);
  };

  const setGovernaneStyle = () => {
    setStackBorder(false);
    setGovernanceBorder(true);
  };

  const disableBorderStyle = () => {
    setStackBorder(false);
    setGovernanceBorder(false);
    dispatch(setOpenConnectDialog(false));
  };
  const theme = useAppSelector((state) => state.theme.themeMode);
  const onSwitchTheme = () => {
    const newTheme = theme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    dispatch(setTheme(newTheme));
  };
  const wallet = useAppSelector((state) => state.wallet);
  useEffect(() => {
    if (account) {
      dispatch(setEthereumAddress(account));
      localStorage.setItem('ethereumAddress', account as string);
    }
  }, [account]);
  const isMobile = useIsMobile(576);
  return (
    <div className={cx('header-parent')}>
      <div className={cx('logo')}>
        <Link to="/" onClick={disableBorderStyle}>
          <img src={theme === THEME_MODE.LIGHT ? dark_logo : logo} alt="logo" />
        </Link>
      </div>
      <div className={cx('stake-governance')}>
        <Link
          to="/stake"
          onClick={testRouter}
          className={cx('link-style', {
            'link-style-border': stackBorder
          })}
        >
          Stake
        </Link>
        <Link
          to="/governance"
          onClick={setGovernaneStyle}
          className={cx('link-style', {
            'link-style-border-right': governanBorder
          })}
        >
          Governance
        </Link>
      </div>
      {/* <h1 style={{ color: 'red' }}>{theme && theme === THEME_MODE.LIGHT ? '123' : '321'}</h1> */}
      {!isMobile && (
        <div className={cx('group-connect-theme')}>
          {/* <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
          label="dark"
          onChange={onSwitchTheme}
        /> */}
          <input type="checkbox" id="switch" onChange={onSwitchTheme} />
          <div className={cx('app')}>
            <div className={cx('body')}>
              <div className={cx('footer-theme')}>
                <span
                  className={cx('footer-theme__item', theme === THEME_MODE.LIGHT ? 'active' : '')}
                  onClick={onSwitchTheme}
                >
                  <img
                    className={cx('icon-theme')}
                    src={theme === THEME_MODE.LIGHT ? lightIcon : light_whiteIcon}
                    alt="light icon"
                  />
                  <span>Light</span>
                </span>
                <span
                  className={cx('footer-theme__item', theme === THEME_MODE.DARK ? 'active' : '')}
                  onClick={onSwitchTheme}
                >
                  <img
                    className={cx('icon-theme')}
                    src={theme === THEME_MODE.DARK ? dark_whiteIcon : darkIcon}
                    alt="dark_icon"
                  />
                  <span>Dark</span>
                </span>
              </div>
            </div>
          </div>
          <div className={cx('header-wallet')}>
            <ConnectWallet />
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;
