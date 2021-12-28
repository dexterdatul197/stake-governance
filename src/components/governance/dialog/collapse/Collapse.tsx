/* eslint-disable array-callback-return */
import { Collapse } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import editIcon from '../../../../assets/icon/edit_icon.png';
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
}
const cx = classNames.bind(styles);

const CollapseItem: React.FC<Props> = ({
  index = 0,
  maxOperation = 0,
  fCallData = [],
  formData = [],
  setFormData = () => {}
}) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const handleAdd = (type: string, index: number) => {
    if (type === 'next') {
      formData.splice(index + 1, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: []
      })
    } else {
      formData.splice(index, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: []
      })
    }
    setFormData(formData);
    setActiveKey(type === 'next' ? index + 1 : index)
  };
  const handleRemove = (index: number) => {
    if (index !== 0)
    formData = formData.filter((_f, idx) => idx < index);
    setFormData(formData);
  }
  const handleKeyUpCommon = (type: string, idx: number, subIdx: any, v: any) => {
    if (type === 'targetAddress') {
      formData[idx].targetAddress = v;
    } else if (type === 'value') {
      formData[idx].value = v;
    } else if (type === 'calldata') {
      formData[idx].callData[subIdx] = v;
    }
    setFormData(formData);
  }

  const handleParseFunc = (signatureValue: string) => {
    if (signatureValue.trim().replace(/^s+|s+$/g, '')) {
      const parsedChn = getArgs(signatureValue);
      formData[index].signature = signatureValue;
      formData[index].callData = [...parsedChn];
      setFormData([...formData]);
    }
  }
  
  const handleKeyupAddress = (e: any) => {
    handleKeyUpCommon('targetAddress', index, null, e.target.value);
  }
  const handleKeyUpCallData = (e: any, cIndex: number) => {
    handleKeyUpCommon('calldata', index, cIndex, e.target.value);
  }
  const handleKeyUpSignature = (e: any) => {
    handleParseFunc(e.target.value);
  }
  return (
    <div className={cx('collapse-item-style')}>
      <div
        className={cx('action-style')}
      >
        <div className={cx('action-text')}
          onClick={() => setOpenCollapse(!openCollapse)}
        >Action {index}</div>
        <img src={editIcon} alt="edit_icon" onClick={() => handleRemove(index)}/>
      </div>
      <Collapse key={activeKey} timeout="auto" in={openCollapse}>
        <div key={activeKey}>
          <div className={cx('border-style')}></div>
          <StakeInputBase
            validate={true}
            name="Address"
            placeholder="Address"
            onKeyUp={handleKeyupAddress}
          />
          <StakeInputBase
            validate={true}
            placeholder="aasumeOwnship(address.string.unit256)"
            name="Signature"
            onKeyUp={handleKeyUpSignature}
          />
          {fCallData.map((c: any, cIndex: number) => {
            return <StakeInputBase key={cIndex}
              validate={true}
              placeholder={`${c}(callData)`}
              name="CallData"
              onKeyUp={(e) => handleKeyUpCallData(e, cIndex)}
            />;
          })}
          {formData.length < +maxOperation && (
            <div>
              {index !== 0 && (
                <div className={cx('btn-add')}>
                  <div
                    className={cx('btn-text')}
                    onClick={() => handleAdd('previous', index)}
                  >
                    Add to previous
                  </div>
                </div>
              )}
              <div className={cx('btn-add')}>
                <div
                  className={cx('btn-text')}
                  onClick={() => handleAdd('next', index)}
                >
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
