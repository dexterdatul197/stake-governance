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
import React, { useCallback } from 'react';
import { stakingToken } from '../../../../helpers/ContractService';



interface Props {
    cx?: any;
    handleBack: () => void;
    handleNext: () => void
}

const Transaction = (props: Props) => {
    const { cx, handleBack, handleNext } = props
    const handleConfirmTransaction = useCallback(async () => {
        handleNext()
        await stakingToken().methods.stake(0, 30).send({ from: '0xD655458D8A11D2DA50cfD2d5D7eAF3f804678588' })
    }, [])


    return (
        <React.Fragment>
            <DialogTitle className={cx('dialog-title__transaction')}>
                <Box className={cx('children_content')}>
                    <ArrowBackIosIcon onClick={handleBack} className={cx('icon_right')} />
                    <Typography className={cx('confirm-title')}>Confirm Transaction</Typography>
                    <CloseIcon onClick={handleConfirmTransaction} className={cx('icon_left')} />
                </Box>
            </DialogTitle>
            <DialogContent className={cx('dialog-content__transaction')}>
                <Box className={cx('children_content')}>
                    <Typography className={cx('token-quantity')}>37</Typography>
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
