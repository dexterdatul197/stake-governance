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
  walletValue?: any;
  handleUpdateSmartContract: () => void;
  chnToken?: any;
}

const Modal = memo((props: Props) => {
  const { openStake, handleCloseModal, walletValue, handleUpdateSmartContract, chnToken } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [balanceValue, setBalanceValue] = useState({
    default: 0,
    isValid: true
  });
  const [isPercent, setIsPercent] = useState(false);
  const [valueBalance, setValueBalance] = useState("0");
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
            walletValue={walletValue}
            handleNext={handleNext}
            setValue={setValue}
            value={value}
            handleCloseModal={handleCloseModal}
            balanceValue={balanceValue}
            setIsPercent={setIsPercent}
            isPercent={isPercent}
            setBalanceValue={setBalanceValue}
            setValueBalance={setValueBalance}
            valueBalance={valueBalance}
          />
        );
      case 1:
        return (
          <Transaction
            value={value}
            cx={cx}
            handleBack={handleBack}
            walletValue={walletValue}
            handleCloseModal={handleCloseModal}
            handleUpdateSmartContract={handleUpdateSmartContract}
            chnToken={chnToken}
            balanceValue={balanceValue}
            isPercent={isPercent}
            valueBalance={valueBalance}
            setValueBalance={setValueBalance}
          />
        );
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setValue({ ...value, default: 0 });
    setBalanceValue({ ...balanceValue, default: 0 });
  };

  const handleBackBegin = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 2);
    setValue({ ...value, default: 0 });
  };

  return (
    <Dialog
      maxWidth="xs"
      className={cx('dialog')}
      open={openStake}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-stake-modal)',
          overflowY: 'unset',
          borderRadius: '20px'
        }
      }}>
      {renderStepContent(activeStep)}
    </Dialog>
  );
});

export default Modal;
