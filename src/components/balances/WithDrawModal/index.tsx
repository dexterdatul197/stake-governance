import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Input, Typography
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import CHN_icon from '../../../assets/icon/CHN.svg';
import { currentAddress } from '../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../helpers/ContractService';
import { useAppSelector } from '../../../store/hooks';
import styles from './styles.module.scss';
import { useMediaQuery } from 'react-responsive'

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

interface Props {
    openWithdraw: boolean;
    handleCloseModalWithDraw: () => void;
    walletValue?: any
    earn: Number
    stake?: any
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
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const WithDraw = (props: Props) => {
    const { openWithdraw, handleCloseModalWithDraw, walletValue, earn, stake } = props;
    const wallet = useAppSelector((state: any) => state.wallet);
    const [isApprove, setApprove] = useState(false);
    const [value, setValue] = useState(0);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    useEffect(() => {
        stake > 0 ? setValue(stake) : setValue(0)
    }, [stake])


    const handleWithdraw = useCallback(async () => {
        try {
            setTimeout(() => {
                setApprove(true)
            }, 1000)
            await getCHNBalance().methods.approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, walletValue).send({ from: currentAddress(wallet) })
        } catch (error) {
            console.log(error);
            handleCloseModalWithDraw()
        }
    }, [wallet])

    const checkApprove = async () => {
        if (isApprove === true) {
            handleCloseModalWithDraw();
            await stakingToken().methods.withdraw(0, value).send({ from: currentAddress(wallet) });
            // setValue(stake)
        }
    }

    useEffect(() => {
        checkApprove()
    }, [isApprove])

    const handleChangeInputValue = useCallback((event: any) => {
        setValue(event.target.value);
    }, [value])




    return (
        <Dialog className={cx('dialog-container')} open={openWithdraw} onClose={() => {
            handleCloseModalWithDraw();
        }} maxWidth={isMobile ? "lg" : "md"} disableEscapeKeyDown>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModalWithDraw}>
                Modal title
            </BootstrapDialogTitle>
            <DialogContent className={cx('dialog-content')}>
                <Box className={(cx('dialog-content__title'))}>
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
                        <Input className={cx('main-right__quantity')} disableUnderline value={value} onChange={handleChangeInputValue} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions className={cx('dialog-actions')}>
                <Button onClick={handleWithdraw} className={cx('button-action')}>Withdraw</Button>
            </DialogActions>
        </Dialog>
    )
}

export default WithDraw
