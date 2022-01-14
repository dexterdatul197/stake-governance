/* eslint-disable array-callback-return */
import { Collapse } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import removeIcon from '../../../../assets/icon/trash.svg';
import { getArgs } from '../../../../helpers/common';
import { SFormData } from '../../../../interfaces/SFormData';
import StakeInputBase from '../../../base/input/StakeInputBase';
import styles from './Collapse.module.scss';
interface Props {
  index?: number;
  maxOperation?: number;
  fCallData?: any[];
  formData?: SFormData[];
  setFormData?: (v: any) => void;
  triggerAlert?: boolean;
}
const cx = classNames.bind(styles);

const CollapseItem: React.FC<Props> = ({
  index = 0,
  maxOperation = 0,
  fCallData = [],
  formData = [],
  setFormData = () => {},
  triggerAlert = false
}) => {
  const [triggerCount, setTriggerCount] = useState(0);

  const [openCollapse, setOpenCollapse] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const handleAdd = (type: string, index: number) => {
    if (type === 'next') {
      formData.splice(index + 1, 0, {
        targetAddress: '',
        value: [],
        signature: '',
        callData: []
      });
    } else {
      formData.splice(index, 0, {
        targetAddress: '',
        value: [],
        signature: '',
        callData: []
      });
    }
    setFormData(formData);
    setActiveKey(type === 'next' ? index + 1 : index);
  };
  const handleRemove = (index: number) => {
    if (index !== 0) formData = formData.filter((_f, idx) => idx !== index);
    setFormData(formData);
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

  useEffect((): any => {
    setTriggerCount(triggerCount + 1);
    if (triggerCount > 0) {
      setOpenCollapse(true);
    }
  }, [triggerAlert]);
  console.log(index);
  return (
    <div className={cx('collapse-item-style')}>
      <div className={cx('action-style')}>
        <div className={cx('action-text')} onClick={() => setOpenCollapse(!openCollapse)}>
          Action {index}
        </div>
        <img src={removeIcon} alt="edit_icon" onClick={() => handleRemove(index)} />
      </div>
      <Collapse key={activeKey} timeout="auto" in={openCollapse}>
        <div key={activeKey} className={cx('div-input')}>
          <div className={cx('border-style')}/>
          <StakeInputBase
            validate={true}
            name="Address"
            value={formData[index].targetAddress}
            placeholder="Address"
            onKeyUp={handleKeyupAddress}
            triggerAlert={triggerAlert}
          />
          <StakeInputBase
            validate={true}
            placeholder="assumeOwnership(address,string,unit256)"
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
              />
            );
          })}
          {formData.length < +maxOperation && (
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
                <div className={cx('btn-text')} onClick={() => handleAdd('next', index)}>
                  Add to next
                </div>
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
};
export default CollapseItem;
