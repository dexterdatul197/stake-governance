/* eslint-disable array-callback-return */
import { Button, Collapse } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import removeIcon from '../../../../assets/icon/trash.svg';
import { VALIDATE_ETH_ADDRESS, VALIDATE_ONLY_NUMBER_ALPHABETS } from '../../../../constant/constants';
import { getArgs, stringToArr } from '../../../../helpers/common';
import { SFormData } from '../../../../interfaces/SFormData';
import StakeInputBase from '../../../base/input/StakeInputBase';
import styles from './Collapse.module.scss';
interface Props {
  collapseIndex?: number;
  index?: number;
  maxOperation?: number;
  fCallData?: any[];
  formData?: SFormData[];
  setFormData?: (v: any) => void;
  triggerAlert?: boolean;
  errorFromChild?: (v: boolean) => void;
}
const cx = classNames.bind(styles);

const CollapseItem: React.FC<Props> = ({
  collapseIndex = 0,
  index = 0,
  maxOperation = 0,
  fCallData = [],
  formData = [],
  setFormData = () => {},
  triggerAlert = false,
  errorFromChild = () => {}
}) => {
  const [triggerCount, setTriggerCount] = useState(0);
  const [childHasError, setChildHasError] = useState(true);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [disableAddToNext, setDisableAddToNext] = useState(false);
  const handleAdd = (type: string, index: number) => {
    if (type === 'next') {
      formData.splice(index + 1, 0, {
        isRemove: false,
        targetAddress: '',
        value: [],
        signature: '',
        callData: [],
        hasError: false
      });
    } else {
      formData.splice(index, 0, {
        isRemove: false,
        targetAddress: '',
        value: [],
        signature: '',
        callData: [],
        hasError: false
      });
    }
    setFormData(formData);
    setActiveKey(type === 'next' ? index + 1 : index);
  };
  const handleRemove = (index: number) => {
    if (index !== 0) formData.splice(index, 1);
    setFormData([...formData]);
  };
  const handleKeyUpCommon = (type: string, idx: number, subIdx: any, v: any) => {
    if (type === 'targetAddress') {
      formData[idx].targetAddress = v;
    } else if (type === 'value') {
      formData[idx].value[subIdx] = v;
    } else if (type === 'calldata') {
      formData[idx].callData[subIdx] = v;
    }
    setFormData(formData);
  };

  const handleParseFunc = (signatureValue: string) => {
    if (signatureValue.trim().replace(/^s+|s+$/g, '')) {
      const parsedChn = getArgs(signatureValue);
      formData[index].signature = signatureValue;
      formData[index].callData = [...parsedChn];
      setFormData([...formData]);
    }
  };

  const handleKeyupAddress = (e: any) => {
    handleKeyUpCommon('targetAddress', index, null, e.target.value);
  };
  const handleKeyUpCallData = (e: any, cIndex: number) => {
    handleKeyUpCommon('calldata', index, cIndex, e.target.value);
    handleKeyUpCommon('value', index, cIndex, e.target.value);
  };
  const handleKeyUpSignature = (e: any) => {
    handleParseFunc(e.target.value);
  };

  const handleErrorFromChild = (param: boolean) => {
    errorFromChild(param);
    formData[index].hasError = param;
    const signatureArr = stringToArr(formData[index].signature);
    const valueArr = formData[index].value;
    if (formData[index].signature.length > 0 && formData[index].targetAddress.length && valueArr.length === signatureArr.length) {
      setChildHasError(param);
    }
  }

  useEffect(() => {
    if (index === (formData.length - 1)) {
      if (childHasError) {
        setDisableAddToNext(true);
      } else {
        setDisableAddToNext(false);
      }
    } else {
      setDisableAddToNext(true);
    }
  }, [formData]);

  useEffect((): any => {
    setTriggerCount(triggerCount + 1);
    if (triggerCount > 0) {
      setOpenCollapse(true);
    }
  }, [triggerAlert]);
  return (
    <div className={cx('collapse-item-style')}>
      <div className={cx('action-style')}>
        <div className={cx('action-text')} onClick={() => setOpenCollapse(!openCollapse)}>
          Action {collapseIndex}
        </div>
        <img src={removeIcon} alt="edit_icon" onClick={() => handleRemove(index)} />
      </div>
      <Collapse key={activeKey} timeout="auto" in={openCollapse}>
        <div key={activeKey} className={cx('div-input')}>
          <div className={cx('border-style')} />
          <StakeInputBase
            validate={true}
            name="Address"
            value={formData[index].targetAddress}
            placeholder="Address"
            onKeyUp={handleKeyupAddress}
            triggerAlert={triggerAlert}
            regexValidate={{regexRole: VALIDATE_ETH_ADDRESS, message: 'Invalid ethereum address!'}}
            errorFromChild={handleErrorFromChild}
          />
          <StakeInputBase
            validate={true}
            placeholder="assumeOwnership(address,string,uint256)"
            name="Signature"
            value={formData[index].signature}
            onKeyUp={handleKeyUpSignature}
            triggerAlert={triggerAlert}
          />
          {fCallData.map((c: any, cIndex: number) => {
            return (
              <StakeInputBase
                key={cIndex}
                validate={true}
                placeholder={`${c}(callData)`}
                value={formData[index].value.length > 0 ? formData[index].value[cIndex] : ''}
                name="CallData"
                onKeyUp={(e) => handleKeyUpCallData(e, cIndex)}
                triggerAlert={triggerAlert}
                validateParamCallData={{k: cIndex, v: formData[index]}}
                errorFromChild={handleErrorFromChild}
              />
            );
          })}
          {formData.length <= +maxOperation && (
            <div>
              {/* {index !== 0 && (
                <div className={cx('btn-add')}>
                  <div
                    className={cx('btn-text')}
                    onClick={() => handleAdd('previous', index)}
                  >
                    Add to previous
                  </div>
                </div>
              )} */}
              <div className={cx('btn-add')}>
                <Button 
                  className={cx(`btn-text`)} 
                  onClick={() => handleAdd('next', index)}
                  disabled={disableAddToNext}
                >
                  Add to next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
};
export default CollapseItem;
