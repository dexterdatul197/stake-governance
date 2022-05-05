import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from './StakeInputBase.module.scss';
import { useAppSelector } from '../../../store/hooks';
import { stringToArr } from '../../../helpers/common';
import { ACTION_PARAM, VALIDATE_ETH_ADDRESS, VALIDATE_ONLY_NUMBER_ALPHABETS } from '../../../constant/constants';

const cx = classNames.bind(styles);

interface Props {
  validate?: boolean;
  type?:
    | 'text'
    | 'password'
    | 'button'
    | 'date'
    | 'file'
    | 'radio'
    | 'search'
    | 'time'
    | 'checkbox'
    | 'email'
    | 'hiddden'
    | 'number';
  name?: string;
  width?: number | string | undefined;
  placeholder?: string;
  value?: string;
  onChange?: (v: any) => void;
  onKeyUp?: (e: any) => void;
  triggerAlert?: boolean;
  regexValidate?: {regexRole: string, message: string};
  errorFromChild?: (v: boolean) => void;
  validateParamCallData?: {k: any, v: any};
}

const StakeInputBase: React.FC<Props> = ({
  type = 'text',
  validate = false,
  name = 'Field',
  width = '95%',
  placeholder = '',
  onChange = () => {},
  onKeyUp = () => {},
  value = '',
  triggerAlert = false,
  regexValidate = null,
  errorFromChild = () => {},
  validateParamCallData = null
}) => {
  const [triggerCount, setTriggerCount] = useState(0);
  const [messageErr, setMessageErr] = useState('');
  const [inputValue, setInputValue] = useState(value);
  const wallet = useAppSelector((state) => state.wallet.ethereumAddress);
  let count = 0;

  const handleOnChange = (event: any) => {
    setMessageErr('');
    let errorField = true;
    if (regexValidate) {
      const regex = new RegExp(regexValidate.regexRole);
      if (!regex.test(event.target.value)) {
        setMessageErr(regexValidate.message);
        errorField = true;
      } else {
        errorField = false;
      }
    }
    if (validateParamCallData) {
      const index = validateParamCallData.k;
      const obj = validateParamCallData.v;
      const signatureArr = stringToArr(obj.signature);
      const paramAtIndex = signatureArr[index];
      if (event.target.value !== '') {
        switch (paramAtIndex) {
          case ACTION_PARAM.ADDRESS:
            const regex = new RegExp(VALIDATE_ETH_ADDRESS);
            if (!regex.test(event.target.value)) {
              setMessageErr('Invalid address!');
              errorField = true;
            } else {
              setMessageErr('');
              errorField = false;
            }
            break;
          case ACTION_PARAM.BOOL:
            if (event.target.value !== 'true' && event.target.value !== 'false') {
              setMessageErr('Not match type bool!');
              errorField = true;
            } else {
              setMessageErr('');
              errorField = false;
            }
            break;
          case ACTION_PARAM.STRING:
            if (event.target.value.length === 0) {
              setMessageErr('Field cannot empty!');
              errorField = true;
            } else {
              setMessageErr('');
              errorField = false;
            }
            break;
          case ACTION_PARAM.UINT256:
            if (isNaN(Number(event.target.value))) {
              setMessageErr('Not match type uint256!');
              errorField = true;
            } else {
              setMessageErr('');
              errorField = false;
            }
            break;
          default:
            break;
        }
      } else {
        errorField = true;
      }
    }
    onChange(event);
    errorFromChild(errorField);
    setInputValue(event.target.value);
  };
  const handleBlur = () => {
    if (inputValue.length === 0) {
      setMessageErr(`${name} cannot empty!`);
      errorFromChild(true);
    } else {
      setMessageErr(``);
      errorFromChild(false);
    }
  };
  const handleKeyUp = (e: any) => {
    onKeyUp(e);
  };

  useEffect((): any => {
    setTriggerCount(triggerCount + 1);
    if (triggerCount > 0) {
      handleBlur();
    }
  }, [triggerAlert]);

  useEffect(() => {
    if (count > 0) {
      setInputValue('');
    }
    count++;
  }, [wallet])

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={cx('wrap-input-base')}>
      <input
        type={type}
        onChange={handleOnChange}
        value={inputValue}
        onBlur={handleBlur}
        className={cx('input-style')}
        placeholder={placeholder}
        onKeyUp={handleKeyUp}
      />
      {validate ? <div className={cx('error-message')}>{messageErr}</div> : null}
    </div>
  );
};
export default StakeInputBase;
