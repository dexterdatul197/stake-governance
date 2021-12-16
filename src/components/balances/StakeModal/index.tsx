import {
  Autocomplete, Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Input, Slider, TextField, Typography
} from "@material-ui/core";
import classNames from "classnames/bind";
import React, { memo, useCallback, useState } from "react";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface Props {
  openStake: boolean;
  handleCloseModal: () => void;
  classes?: any;
  currencies?: any;
}

const Modal = memo((props: Props) => {
  const { openStake, handleCloseModal, classes, currencies } = props;
  const [value, setValue] = useState({
    default: 0,
    value1: 25,
    value2: 50,
    value3: 75,
    all: 100,
  });

  const handleChangeValue = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: event.target.value };
      setValue(_value);
    },
    [value.default]
  );

  const valueText = (value: any) => {
    return `${value}%`;
  };

  const handleChangeInputPercent = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 25 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent2 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 50 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent3 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 75 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent4 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 100 };
      setValue(_value);
    },
    [value]
  );

  return (
    <Dialog
      maxWidth="xs"
      className={cx("dialog")}
      open={openStake}
      onClose={handleCloseModal}
      PaperProps={{
        style: {
          backgroundColor: "var(--background-stake-modal)",
          overflowY: "unset",
          borderRadius: '20px'
        },
      }}
    >
      <DialogTitle className={cx("title-dialog")}>
        <Typography className={cx("text-stake")}>Stake</Typography>
        <Box></Box>
      </DialogTitle>
      <DialogContent className={cx("dialog-content")}>
        <Box className={cx("dialog-content__amount")}>
          <Typography className={cx("title")}>Amount</Typography>
          <Input
            disabled
            disableUnderline
            className={cx("input")}
            value={`${value.default}%`}
            size="small"
            onChange={handleChangeValue}
          />
          <Slider
            className={cx("slider")}
            value={typeof value.default === "number" ? value.default : 0}
            onChange={handleChangeValue}
            getAriaValueText={valueText}
          />
          <Box className={cx("dialog-content__percent")}>
            <Input
              onClick={handleChangeInputPercent}
              className={cx("percent-number")}
              disabled
              disableUnderline
              value={valueText(value.value1)}
            />
            <Input
              onClick={handkeChangeInputPercent2}
              className={cx("percent-number")}
              disabled
              disableUnderline
              value={valueText(value.value2)}
            />
            <Input
              onClick={handkeChangeInputPercent3}
              className={cx("percent-number")}
              disabled
              disableUnderline
              value={valueText(value.value3)}
            />
            <Input
              onClick={handkeChangeInputPercent4}
              className={cx("percent-number")}
              disabled
              disableUnderline
              value={value.all ? "All" : 0}
            />
          </Box>
        </Box>
        <Box className={cx("balance")}>
          <Box className={cx("balance__wallet-balance")}>
            <Typography className={cx('title')}>Wallet Balance: 42</Typography>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={"chn"}
              className={cx('autocomplete')}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={"small"}
              id="combo-box-demo"
            />
          </Box>
          <Box className={cx("balance__stake-balance")}>
            <Typography className={cx('title')}>Stake Balance: 42</Typography>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={"chn"}
              className={cx('autocomplete')}
              renderInput={(item) => (
                <TextField {...item} margin="normal" fullWidth />
              )}
              size={"small"}
              id="combo-box-demo"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-action')}>
        <Button className={cx("button-stake")}>Stake</Button>
      </DialogActions>
    </Dialog>
  );
});

export default Modal;
