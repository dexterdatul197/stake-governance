import React, { useCallback, useEffect, memo, useState } from "react";
import {
    DialogContent,
    DialogTitle,
    DialogActions,
    Dialog,
    IconButton,
    Typography,
    Box,
    Button,
} from "@material-ui/core";
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames/bind";
import CHN_icon from '../../../assets/icon/CHN.svg'

const cx = classNames.bind(styles);

interface Props {
    openWithdraw: boolean;
    handleCloseModalWithDraw: () => void;
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
    const { openWithdraw, handleCloseModalWithDraw } = props
    return (
        <Dialog className={cx('dialog-container')} open={openWithdraw} onClose={handleCloseModalWithDraw} maxWidth="md">
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
                        <img className={cx('main-left__icon')} src={CHN_icon} />
                        <Box className={cx('main-left__text')}>
                            <Typography className={cx('token-title')}>Token</Typography>
                            <Typography className={cx('token-text')}>CHN</Typography>
                        </Box>
                    </Box>
                    <Box className={cx('main-right')}>
                        <Typography className={cx('main-right__price')}>~$0.00</Typography>
                        <Typography className={cx('main-right__quantity')}>0</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions className={cx('dialog-actions')}>
                <Button className={cx('button-action')}>Withdraw</Button>
            </DialogActions>
        </Dialog>
    )
}

export default WithDraw
