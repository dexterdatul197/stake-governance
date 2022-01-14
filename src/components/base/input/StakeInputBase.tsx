import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from './StakeInputBase.module.scss';

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
  triggerAlert = false
}) => {
  const [triggerCount, setTriggerCount] = useState(0);
  const [messageErr, setMessageErr] = useState('');
  const [inputValue, setInputValue] = useState(value);
  const handleOnChange = (event: any) => {
    setMessageErr('');
    setInputValue(event.target.value);
    onChange(event.target.value);
  };
  const handleBlur = () => {
    if (inputValue.length === 0) {
      setMessageErr(`${name} cannot empty!`);
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
