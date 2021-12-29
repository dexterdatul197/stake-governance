import {
  Dialog,
} from "@material-ui/core";
import classNames from "classnames/bind";
import { memo, useCallback, useState } from "react";
import { setTimeout } from "timers";
import Stake from "./Stake";
import styles from "./styles.module.scss";
import Transaction from "./Transaction";

const cx = classNames.bind(styles);

interface Props {
  openStake: boolean;
  handleCloseModal: () => void;
  classes?: any;
  currencies?: any;
  walletValue?: any;
}




const Modal = memo((props: Props) => {
  const { openStake, handleCloseModal, classes, currencies, walletValue } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(false)

  const renderStepContent = (step: Number) => {
    switch (step) {
      case 0:
        return <Stake cx={cx} classes={classes} currencies={currencies} walletValue={walletValue} handleNext={handleNext} progress={progress} />
      case 1:
        return <Transaction cx={cx} handleCloseModal={handleCloseModal} handleBack={handleBack} setActiveStep={setActiveStep} />
    }
  }

  const handleNext = () => {
    setProgress(true)
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setProgress(false)
    }, 1000)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


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
          borderRadius: "20px",
        },
      }}
    >
      {renderStepContent(activeStep)}

    </Dialog>
  );
});

export default Modal;
