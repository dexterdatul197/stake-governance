import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography,
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import CHN_icon from '../../../assets/icon/CHN.svg';
import { currentAddress } from '../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import styles from './styles.module.scss';
import { BigNumber } from '@0x/utils';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

interface Props {
  openWithdraw: boolean;
  handleCloseModalWithDraw: () => void;
  walletValue?: any;
  earn: Number;
  stake?: any;
  handleUpdateSmartContract: () => void;
}

const BootstrapDialogTitle = (props: any) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className={cx('dialig-title')} sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const WithDraw = (props: Props) => {
  const { openWithdraw, handleCloseModalWithDraw, earn, stake, handleUpdateSmartContract } = props;
  const wallet = useAppSelector((state: any) => state.wallet);
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(false);

  const handleChangeInputValue = useCallback(
    (event: any) => {
      setValue(event.target.value);
    },
    [value]
  );

  useEffect(() => {
    if (stake) {
      setValue(stake);
    }
  }, [stake]);

  const handleWithdraw = async () => {
    try {
      setProgress(true);
      setTimeout(() => {
        setProgress(false);
      }, 1000);
      console.log('value: ', value);
      await stakingToken()
        .methods.withdraw(0, new BigNumber(value).multipliedBy('1e18'))
        .send({ from: currentAddress(wallet) });
      handleUpdateSmartContract();
    } catch (error) {
      console.log(error);
      handleCloseModalWithDraw();
      setProgress(false);
    }
  };

  return (
    <Dialog
      className={cx('dialog-container')}
      open={openWithdraw}
      onClose={() => {
        handleCloseModalWithDraw();
        setValue(stake);
      }}
      maxWidth="md"
      disableEscapeKeyDown
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => {
          handleCloseModalWithDraw();
          setValue(stake);
        }}
      >
        Modal title
      </BootstrapDialogTitle>
      <DialogContent className={cx('dialog-content')}>
        <Box className={cx('dialog-content__title')}>
          <Typography className={cx('amount')}>Amount</Typography>
          <Typography className={cx('available')}>Available</Typography>
        </Box>
        <Box className={cx('dialog-content__children')}>
          <Box className={cx('main-left')}>
            <img className={cx('main-left__icon')} src={CHN_icon} alt="CHN_icon" />
            <Box className={cx('main-left__text')}>
              <Typography className={cx('token-title')}>Token</Typography>
              <Typography className={cx('token-text')}>CHN</Typography>
            </Box>
          </Box>
          <Box className={cx('main-right')}>
            <Typography className={cx('main-right__price')}>${format(earn)}</Typography>
            <Input
              className={cx('main-right__quantity')}
              disableUnderline
              value={value}
              onChange={handleChangeInputValue}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions')}>
        <Button onClick={handleWithdraw} className={cx('button-action')}>
          {progress ? <CircularProgress style={{ color: '#ffffff' }} /> : 'Withdraw'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithDraw;
