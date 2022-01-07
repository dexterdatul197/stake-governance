import { Dialog } from '@material-ui/core';
import classNames from 'classnames/bind';
import { memo, useState } from 'react';
import { setTimeout } from 'timers';
import Stake from './Stake';
import styles from './styles.module.scss';
import Transaction from './Transaction';
import LoadingComponent from './isLoading';

const cx = classNames.bind(styles);

interface Props {
  openStake: boolean;
  handleCloseModal: () => void;
  classes?: any;
  currencies?: any;
  walletValue?: any;
  handleUpdateSmartContract: () => void;
}

const Modal = memo((props: Props) => {
  const {
    openStake,
    handleCloseModal,
    classes,
    currencies,
    walletValue,
    handleUpdateSmartContract
  } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(false);

  const [value, setValue] = useState({
    default: 0,
    value1: 25,
    value2: 50,
    value3: 75,
    all: 100
  });
  const renderStepContent = (step: Number) => {
    switch (step) {
      case 0:
        return (
          <Stake
            cx={cx}
            classes={classes}
            currencies={currencies}
            walletValue={walletValue}
            handleNext={handleNext}
            progress={progress}
            setValue={setValue}
            value={value}
          />
        );
      case 1:
        return (
          <Transaction
            value={value}
            cx={cx}
            handleBack={handleBack}
            handleNext={handleNext}
            walletValue={walletValue}
            handleCloseModal={handleCloseModal}
            handleUpdateSmartContract={handleUpdateSmartContract}
          />
        );
      // case 2:
      //   return <LoadingComponent />
    }
  };

  const handleNext = () => {
    setProgress(true);
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setProgress(false);
    }, 1000);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setValue({ ...value, default: 0 });
  };

  return (
    <Dialog
      maxWidth="xs"
      className={cx('dialog')}
      open={openStake}
      onClose={() => {
        setValue({ ...value, default: 0 });
        handleCloseModal();
        setTimeout(() => {
          setActiveStep(0);
        }, 500);
      }}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-stake-modal)',
          overflowY: 'unset',
          borderRadius: '20px'
        }
      }}
    >
      {renderStepContent(activeStep)}
    </Dialog>
  );
});

export default Modal;
