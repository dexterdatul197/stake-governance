import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { stakingToken, getCHNBalance } from '../../../../helpers/ContractService';
import { currentAddress } from '../../../../helpers/common';
import { useAppSelector } from '../../../../store/hooks';
import { BigNumber } from '@0x/utils';



interface Props {
    cx?: any;
    handleBack: () => void;
    handleNext: () => void;
    value?: any;
    walletValue?: any;
    handleCloseModal: () => void;
}

const Transaction = (props: Props) => {
    const { cx, handleBack, handleNext, value, walletValue, handleCloseModal } = props;
    const wallet = useAppSelector((state: any) => state.wallet);
    const [isApprove, setApprove] = useState(false);
    const amount = (value.default * walletValue)

    const handleConfirmTransaction = useCallback(async () => {
        try {
            // handleNext()
            setTimeout(() => {
                setApprove(true)
            }, 1000)
            await getCHNBalance().methods.approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, amount).send({ from: currentAddress(wallet) })
        } catch (error) {
            console.log(error);
            setApprove(false)
            handleCloseModal();
        }
    }, [])

    const checkApprove = async () => {
        if (isApprove === true) {
            handleCloseModal();
            await stakingToken().methods.stake(0, walletValue).send({ from: currentAddress(wallet) })
        }
    }

    useEffect(() => {
        checkApprove()
    }, [isApprove])



    return (
        <React.Fragment>
            <DialogTitle className={cx('dialog-title__transaction')}>
                <Box className={cx('children_content')}>
                    <ArrowBackIosIcon onClick={handleBack} className={cx('icon_right')} />
                    <Typography className={cx('confirm-title')}>Confirm Transaction</Typography>
                    <CloseIcon onClick={handleCloseModal} className={cx('icon_left')} />
                </Box>
            </DialogTitle>
            <DialogContent className={cx('dialog-content__transaction')}>
                <Box className={cx('children_content')}>
                    <Typography className={cx('token-quantity')}>{Math.floor(value.default * walletValue / 100)}</Typography>
                    <Typography className={cx('token-stake')}>CHN STAKE</Typography>
                </Box>
            </DialogContent>
            <DialogActions className={cx('dialog-actions__transaction')}>
                <Button onClick={handleConfirmTransaction} className={cx('dialog-actions__transaction__confirm')}>Confirm</Button>
            </DialogActions>
        </React.Fragment>
    )
}

export default Transaction
