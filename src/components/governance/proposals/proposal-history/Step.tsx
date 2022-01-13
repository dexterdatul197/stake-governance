import classNames from 'classnames/bind';
import React from 'react';
import styles from './ProposalHistory.module.scss';
import CheckedIcon from '../../../../assets/icon/checked.svg';

type Props = {
  title?: string;
  description?: string;
};
const cx = classNames.bind(styles);

const Step: React.FC<Props> = ({ title, description }) => {
  return (
    <>
      <div className={cx('step')}>
        <img src={CheckedIcon}></img>
        <div className={cx('step-content')}>
          <div className={cx('step-content-title')}>{title}</div>
          <div className={cx('step-content-description')}>{description}</div>
        </div>
      </div>
    </>
  );
};

export default Step;
