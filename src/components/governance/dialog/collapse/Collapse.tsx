import { Collapse } from '@material-ui/core';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import editIcon from '../../../../assets/icon/edit_icon.png';
import { SFormData } from '../../../../interfaces/SFormData';
import StakeInputBase from '../../../base/input/StakeInputBase';
import styles from './Collapse.module.scss';
interface Props {
  index?: number;
  maxOperation?: number;
  fCallData?: [];
  formData?: SFormData[];
}
const cx = classNames.bind(styles);

const CollapseItem: React.FC<Props> = ({
  index = 0,
  maxOperation = 0,
  fCallData = [],
  formData = []
}) => {
  console.log('COLLAPSE: ', formData.length, maxOperation);
  
  const [openCollapse, setOpenCollapse] = useState(false);
  const handleParseFunc = () => {}
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
  };
  return (
    <div className={cx('collapse-item-style')}>
      <div
        className={cx('action-style')}
        onClick={() => setOpenCollapse(!openCollapse)}
      >
        <div className={cx('action-text')}>Action {index}</div>
        <img src={editIcon} alt="edit_icon" />
      </div>
      <Collapse key={1} timeout="auto" in={openCollapse}>
        <div key={1}>
          <div className={cx('border-style')}></div>
          <StakeInputBase
            validate={true}
            name="Address"
            placeholder="Address"
            onKeyUp={() => handleParseFunc()}
          />
          <StakeInputBase
            validate={true}
            placeholder="aasumeOwnship(address.string.unit256)"
            name="Signature"
          />
          {fCallData.map((c, cIdx) => {
            <StakeInputBase
              validate={true}
              placeholder={`${c}(callData)`}
              name="CallData"
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
