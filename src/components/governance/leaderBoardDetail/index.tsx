import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import BackArrow from '../../back-arrow/BackArrow';
import styles from './styles.module.scss';
import { ReactComponent as AddressIcon } from '../../../assets/icon/icon-address.svg';
import { ReactComponent as UserIcon } from '../../../assets/icon/user.svg';
import ProposalHistory from './proposalsHistory';
import { getDataLeaderBoardDetail } from '../../../apis/apis';
import { ethAddressPage } from '../../../helpers/ContractService';
import { format } from '../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../helpers/ContractService';
import { BigNumber } from '@0x/utils';
import Web3 from 'web3';

const web3 = new Web3();
const cx = classNames.bind(styles);

interface Props {
  address: any;
  match?: any;
}

const Detail = (props: Props) => {
  const address = props.match.params.address;
  const [chn, setCHN] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      const contractBalance = await getCHNBalance();
      const contractStaking = await stakingToken();
      const CHN = await contractBalance.balanceOf(address);
      const getValueStake = await contractStaking.userInfo(0, address);
      const formatCHN = new BigNumber(CHN).div('1e18').div(10);
      const formatStake = new BigNumber(getValueStake.amount).div('1e18');
      setCHN(format(formatCHN.toFixed(4).toString()));
      setBalance(format(formatStake.toFixed(4).toString()));
    };
    getBalance();
  }, [chn]);

  const goToEthereumAddress = (address: string) => {
    window.open(`${ethAddressPage()}/${address}`, '_blank');
  };

  return (
    <Box className={cx('details')}>
      <BackArrow title="Details" />
      <Box className={cx('main')}>
        <Box className={cx('main__address')}>
          <span>{`${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`}</span>
          <Box className={cx('address')}>
            <span onClick={() => goToEthereumAddress(address)}>{address}</span>
            <AddressIcon style={{ cursor: 'pointer' }} />
          </Box>
        </Box>

        <Box className={cx('holding_transaction')}>
          <Box className={cx('holding')}>
            <span className={cx('title')}>Holding</span>
            <Box className={cx('holding__balance')}>
              <Box className={cx('holding__balance__left')}>
                <span>Balance</span>
                <span>{chn}</span>
              </Box>
              <Box className={cx('holding__balance__right')}>
                <Box className={cx('content-left')}>
                  <span>CHN</span>
                  <span>{balance}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <ProposalHistory address={address} />
      </Box>
    </Box>
  );
};

export default Detail;
