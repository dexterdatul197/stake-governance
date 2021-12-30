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
import React from 'react';


interface Props {
    cx?: any;
    handleCloseModal: () => void;
    handleBack: () => void
    setActiveStep?: any
}

const Transaction = (props: Props) => {
    const { cx, handleCloseModal, handleBack, setActiveStep } = props
    const handleConfirmTransaction = () => {
        handleCloseModal();
        setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    }
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
