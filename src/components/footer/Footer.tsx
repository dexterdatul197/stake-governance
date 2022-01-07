import classNames from "classnames/bind";
import React from "react";
import { useDispatch } from "react-redux";
import { THEME_MODE } from "../../constant/constants";
import useIsMobile from "../../hooks/useMobile";
import { useAppSelector } from "../../store/hooks";
import { setTheme } from "../../store/theme";
import ConnectWallet from "../connect-wallet/ConnectWallet";
import dark_whiteIcon from "./../../assets/icon/dark-white.svg";
import darkIcon from "./../../assets/icon/dark.svg";
import light_whiteIcon from "./../../assets/icon/light-white.svg";
import lightIcon from "./../../assets/icon/light.svg";
import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

const Footer: React.FC = () => {
  const isMobile = useIsMobile(375);
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.theme.themeMode);

  const onSwitchTheme = () => {
    const newTheme =
      theme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    dispatch(setTheme(newTheme));
  };

  return (
    <div className={cx("footer-component")}>
      {isMobile ? (
        <div className={cx("footer")}>
          <ConnectWallet />
          <div className={cx("footer-theme")}>
            <span
              className={cx(
                "footer-theme__item",
                theme === THEME_MODE.LIGHT ? "active" : ""
              )}
              onClick={onSwitchTheme}
            >
              <img
                className={cx("icon-theme")}
                src={theme === THEME_MODE.LIGHT ? lightIcon : light_whiteIcon}
                alt="light icon"
              />
              <span>Light</span>
            </span>
            <span
              className={cx(
                "footer-theme__item",
                theme === THEME_MODE.DARK ? "active" : ""
              )}
              onClick={onSwitchTheme}
            >
              <img
                className={cx("icon-theme")}
                src={theme === THEME_MODE.DARK ? dark_whiteIcon : darkIcon}
                alt="dark_icon"
              />
              <span>Dark</span>
            </span>
          </div>
        </div>
      ) : (
        <>
          <div>&copy; Chain 1 open source</div>
          <div>vi.o\Block 275</div>
        </>
      )}
    </div>
  );
};
export default Footer;
