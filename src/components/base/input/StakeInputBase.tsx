import classNames from "classnames/bind";
import React, { useState } from "react";
import styles from './StakeInputBase.module.scss';
const cx = classNames.bind(styles);

interface Props {
    validate?: boolean;
    type?: 'text'| 'password'| 'button'| 'date' | 'file' | 'radio'| 'search'| 'time'|'checkbox'|'email'|'hiddden'|'number'
    name?: string;
    width?: number | string | undefined;
    placeholder?: string;
    onChange?: (v:any) => void;
    onKeyUp?: (e: any) => void;
}



const StakeInputBase:React.FC<Props> = ({
    type = 'text',
    validate = false,
    name = 'Field',
    width = '95%',
    placeholder = '',
    onChange = () => {},
    onKeyUp = () => {}
}) => {
    const [messageErr, setMessageErr] = useState('');
    const [value, setValue] = useState('');
    const handleOnChange = (event: any) => {
        setMessageErr('');
        setValue(event.target.value);
        onChange(event.target.value);
    }
    const handleBlur = () => {
        if (value.length === 0) {
            setMessageErr(`${name} cannot empty!`);
        }
    }
    const handleKeyUp = (e: any) => {
        onKeyUp(e);
    }
    return (
        <div className={cx('wrap-input-base')}>
            <input 
                type={type} 
                onChange={handleOnChange} 
                value={value}
                onBlur={handleBlur}
                className={cx('input-style')}
                placeholder={placeholder}
                onKeyUp={handleKeyUp}
            />
            {validate ? (
                <div className={cx('error-message')}>{messageErr}</div>
            ) : null}
        </div>
    )
}
export default StakeInputBase;