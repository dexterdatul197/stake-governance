import React, { useState } from 'react';
import {
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    Dialog,
    Typography,
    Slider,
    Input,
    Box
} from '@material-ui/core';
import classNames from 'classnames/bind';
import styles from './styles.module.scss'

const cx = classNames.bind(styles);

interface Props {
    openStake: boolean;
    handleCloseModal: () => void

}

const Modal = (props: Props) => {
    const { openStake, handleCloseModal } = props;
    const [value, setValue] = useState(0);

    const handleChangeValue = (event: any, newValue: any) => {
        setValue(newValue)
    }

    const handleInputChange = (event: any) => {
        setValue(event.target.value === '' ? '' : event.target.value);
    };

    return (
        <Dialog maxWidth="xs" className={cx('dialog')} open={openStake} onClose={handleCloseModal}>
            <DialogTitle className={cx('title-dialog')}>
                <Typography className={cx('text-stake')}>Stake</Typography>
                <Box></Box>
            </DialogTitle>
            <DialogContent className={cx('dialog-content')}>
                <Box className={cx('dialog-content__amount')}>
                    <Typography className={cx('title')}>Amount</Typography>
                    <Input disabled disableUnderline className={cx('input')} value={`${value}%`} size="small" onChange={handleInputChange} />
                    <Slider className={cx('slider')} value={typeof value === 'number' ? value : 0} onChange={handleChangeValue} />
                    <Box className={cx('dialog-content__percent')}>
                        <Typography className={cx('percent-number')}>25%</Typography>
                        <Typography className={cx('percent-number')}>50%</Typography>
                        <Typography className={cx('percent-number')}>75%</Typography>
                        <Typography className={cx('percent-number')}>All</Typography>
                    </Box>
                </Box>

            </DialogContent>
        </Dialog>
    )
}

export default Modal
