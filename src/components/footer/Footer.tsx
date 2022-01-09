import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { THEME_MODE } from '../../constant/constants';
import useIsMobile from '../../hooks/useMobile';
import { useAppSelector } from '../../store/hooks';
import { setTheme } from '../../store/theme';
import ConnectWallet from '../connect-wallet/ConnectWallet';
import dark_whiteIcon from './../../assets/icon/dark-white.svg';
import darkIcon from './../../assets/icon/dark.svg';
import light_whiteIcon from './../../assets/icon/light-white.svg';
import lightIcon from './../../assets/icon/light.svg';
import styles from './Footer.module.scss';
import Web3 from 'web3';
import { SetCalldataBlock } from '@0x/utils/lib/src/abi_encoder/calldata/blocks/set';

const cx = classNames.bind(styles);
const currentRPC =
  process.env.REACT_APP_ENV === 'prod'
    ? process.env.REACT_APP_MAINNET_RPC
    : process.env.REACT_APP_RINKEBY_RPC;
const Footer: React.FC = () => {
  const isMobile = useIsMobile(576);
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.theme.themeMode);
  const [block, setBlock] = useState(0);

  const onSwitchTheme = () => {
    const newTheme = theme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    dispatch(setTheme(newTheme));
  };

  const getLatestBlock = async () => {
    if (typeof currentRPC === 'string') {
      const web3 = await new Web3(currentRPC);
      const block = await web3.eth.getBlockNumber();
      setBlock(block);
    }
  };

  const openEther = () => {
    window.open('https://etherscan.io', '_blank');
  };

  useEffect(() => {
    getLatestBlock();
    setInterval(async () => {
      getLatestBlock();
    }, 15000);
  }, []);

  return (
    <div className={cx('footer-component')}>
      {isMobile ? (
        <div className={cx('footer')}>
          <ConnectWallet />
          <div className={cx('footer-theme')}>
            <span
              className={cx('footer-theme__item', theme === THEME_MODE.LIGHT ? 'active' : '')}
              onClick={onSwitchTheme}>
              <img
                className={cx('icon-theme')}
                src={theme === THEME_MODE.LIGHT ? lightIcon : light_whiteIcon}
                alt="light icon"
              />
              <span>Light</span>
            </span>
            <span
              className={cx('footer-theme__item', theme === THEME_MODE.DARK ? 'active' : '')}
              onClick={onSwitchTheme}>
              <img
                className={cx('icon-theme')}
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
          <div className={cx('right-footer')}>
            <div className={cx('status-circle')}></div>
            <div onClick={openEther} className={cx('block-number')}>
              vi.o\Block: {block}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Footer;
