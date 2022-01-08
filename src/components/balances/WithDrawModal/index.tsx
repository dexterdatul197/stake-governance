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
import useIsMobile from '../../../hooks/useMobile';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import styles from './styles.module.scss';
import { BigNumber } from '@0x/utils';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

interface Props {
  openWithdraw: boolean;
  handleCloseModalWithDraw: () => void;
  walletValue?: any;
  earn?: any;
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
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const WithDraw = (props: Props) => {
  const { openWithdraw, handleCloseModalWithDraw, earn, stake, handleUpdateSmartContract } = props;
  const wallet = useAppSelector((state: any) => state.wallet);
  const [value, setValue] = useState({
    defaultValue: 0,
    isValid: true
  });
  const [progress, setProgress] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (stake) {
      setValue({ ...value, defaultValue: stake });
    }
  }, [stake]);

  const handleWithdraw = async () => {
    try {
      setProgress(true);
      setTimeout(() => {
        setProgress(false);
      }, 1000);

      if (stake) {
        await stakingToken()
          .methods.withdraw(0, new BigNumber(value.defaultValue).multipliedBy('1e18'))
          .send({ from: currentAddress(wallet) });
        handleCloseModalWithDraw();
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();
      } else if (earn) {
        await stakingToken()
          .methods.withdraw(0, new BigNumber(earn).multipliedBy('1e18'))
          .send({ from: currentAddress(wallet) });
        handleCloseModalWithDraw();
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();
      } else {
        dispatch(
          openSnackbar({
            message: 'Withdraw Failed',
            variant: SnackbarVariant.ERROR
          })
        );
      }
    } catch (error) {
      console.log(error);
      handleCloseModalWithDraw();
      setProgress(false);
    }
  };

  const validateNumberField = (myNumber: any) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  const handleChangeInputValue = useCallback(
    (event: any) => {
      const { value } = event.target;
      const isValid = !value || validateNumberField(value);
      const newValue = { ...value };
      setValue({ ...newValue, defaultValue: value, isValid });
    },
    [value.defaultValue]
  );

  return (
    <Dialog
      className={cx('dialog-container')}
      open={openWithdraw}
      onClose={() => {
        handleCloseModalWithDraw();
        setValue({ ...value, defaultValue: stake });
      }}
      maxWidth="md"
      disableEscapeKeyDown>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => {
          handleCloseModalWithDraw();
          setValue({ ...value, defaultValue: stake });
        }}>
        Withdraw
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
            <Typography className={cx('main-right__price')}>{format(earn)}</Typography>
            <Input
              className={cx('main-right__quantity')}
              disableUnderline
              value={value.defaultValue}
              onChange={handleChangeInputValue}
            />
            {!value.isValid && <div style={{ color: 'red' }}>Entered Number is invalid</div>}
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
