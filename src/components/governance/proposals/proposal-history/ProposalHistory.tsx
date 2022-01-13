import classNames from 'classnames/bind';
import React from 'react';
import { ProposalDetailForm } from '../../../../interfaces/SFormData';
import styles from './ProposalHistory.module.scss';
import CheckedIcon from '../../../../assets/icon/checked.svg';
import Step from './Step';
import moment from 'moment';

interface Props {
  proposalInfo?: ProposalDetailForm;
}
const cx = classNames.bind(styles);

const ProposalHistory: React.FC<Props> = ({ proposalInfo }) => {
  console.log('Proposal history:', proposalInfo);

  return (
    <div className={cx('proposal-history')}>
      <div className={cx('history-title')}>Proposal History</div>
      <div className={cx('history-content')}>
        <Step
          title="Created"
          description={
            proposalInfo?.createdTimestamp
              ? moment(proposalInfo.createdTimestamp * 1000).format('LLL')
              : ''
          }
        />
        <Step
          title="Active"
          description={
            proposalInfo?.startTimestamp
              ? moment(proposalInfo.startTimestamp * 1000).format('LLL')
              : ''
          }
        />
        <Step
          title={
            proposalInfo?.state === 'Canceled' || proposalInfo?.state === 'Defeated'
              ? proposalInfo.state === 'Defeated'
                ? 'Failed'
                : 'Canceled'
              : `${proposalInfo?.state === 'Succeeded' ? 'Succeeded' : 'Succeed'}`
          }
          description={
            proposalInfo?.endTimestamp ? moment(proposalInfo.endTimestamp * 1000).format('LLL') : ''
          }
        />
        <Step
          title={`${proposalInfo?.state === 'Queued' ? 'Queued' : 'Queue'}`}
          description={
            proposalInfo?.queuedTimestamp
              ? moment(proposalInfo.queuedTimestamp * 1000).format('LLL')
              : ''
          }
        />
        <Step
          title={
            proposalInfo?.state === 'Expired'
              ? proposalInfo.state
              : `${proposalInfo?.state === 'Executed' ? 'Executed' : 'Execute'}`
          }
          description={
            proposalInfo?.executedTimestamp
              ? moment(proposalInfo.executedTimestamp * 1000).format('LLL')
              : ''
          }
        />
      </div>
    </div>
  );
};
export default ProposalHistory;
