import classNames from 'classnames/bind';
import React from 'react';
import styles from './ProposalHistory.module.scss';
import CheckedIcon from '../../../../assets/icon/checked.svg';
import UnCheckedIcon from '../../../../assets/icon/un-checked.svg';

type Props = {
  title?: string;
  description?: string;
  unCheck?: boolean;
};
const cx = classNames.bind(styles);

const Step: React.FC<Props> = ({ title, description, unCheck }) => {
  return (
    <>
      <div className={cx('step')}>
        <img src={unCheck ? UnCheckedIcon : CheckedIcon}></img>
        <div className={cx('step-content')}>
          <div className={cx('step-content-title')}>{title}</div>
          <div className={cx('step-content-description')}>{description}</div>
        </div>
      </div>
    </>
  );
};

export default Step;
