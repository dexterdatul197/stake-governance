import classnames from "classnames/bind";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { THEME_MODE } from "../../constant/constants";
import { isConnected } from "../../helpers/connectWallet";
import { useAppSelector } from "../../store/hooks";
import { setTheme } from "../../store/theme";
import ConnectWallet from "../connect-wallet/ConnectWallet";
import { setOpenConnectDialog } from "../connect-wallet/redux/wallet";
import dark_whiteIcon from "./../../assets/icon/dark-white.svg";
import darkIcon from "./../../assets/icon/dark.svg";
import light_whiteIcon from "./../../assets/icon/light-white.svg";
import lightIcon from "./../../assets/icon/light.svg";
import dark_logo from "./../../assets/imgs/chn_dark_logo.png";
import logo from "./../../assets/imgs/CHN_logo.png";
import style from "./Header.module.scss";
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
  };

  const disableBorderStyle = () => {
    setStackBorder(false);
    setGovernanceBorder(false);
  };
  const theme = useAppSelector((state) => state.theme.themeMode);
  const onSwitchTheme = () => {
    const newTheme =
      theme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    dispatch(setTheme(newTheme));
  };
  const wallet = useAppSelector((state) => state.wallet);
  return (
    <div className={cx("header-parent")}>
      <div className={cx("logo")}>
        <Link to="/" onClick={disableBorderStyle}>
          <img src={theme === THEME_MODE.LIGHT ? dark_logo : logo} alt="logo" />
        </Link>
      </div>
      <div className={cx("stake-governance")}>
        {isConnected(wallet) ? (
          <Link
            to="/stake"
            onClick={testRouter}
            className={stackBorder ? cx("link-style-border") : cx("link-style")}
          >
            Stake
          </Link>
        ) : (
          <Link to="/" onClick={openDialogConnect} className={cx("link-style")}>
            Stake
          </Link>
        )}
        <Link
          to="/governance"
          onClick={setGovernaneStyle}
          className={
            governanBorder ? cx("link-style-border") : cx("link-style")
          }
        >
          Governance
        </Link>
      </div>
      <div className={cx("group-connect-theme")}>
        {/* <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
          label="dark"
          onChange={onSwitchTheme}
        /> */}
        <input type="checkbox" id="switch" onChange={onSwitchTheme} />
        <div className={cx("app")}>
          <div className={cx("body")}>
            <label htmlFor="switch">
              <div className={cx("toggle")}></div>
              <div className={cx("names")}>
                {theme === THEME_MODE.LIGHT ? (
                  <>
                    <p className={cx("light")}>
                      <img className={cx('icon-theme')} src={lightIcon} alt="light icon"/>
                      light
                    </p>
                    <p className={cx("dark")}>
                      <img className={cx('icon-theme')} src={darkIcon} alt="" />
                      dark</p>
                  </>

                ) : (
                  <>
                    <p className={cx("light")}>
                      <img className={cx('icon-theme')} src={light_whiteIcon} alt="dark icon"/>
                      light
                    </p>
                    <p className={cx("dark")}>
                      <img className={cx('icon-theme')} src={dark_whiteIcon} alt="" />
                      dark</p>
                  </>
                )}

              </div>
            </label>
          </div>
        </div>
        <ConnectWallet />
      </div>
    </div>
  );
};
export default Header;
