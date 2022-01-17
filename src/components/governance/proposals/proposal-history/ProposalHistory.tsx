import classNames from 'classnames/bind';
import React from 'react';
import { ProposalDetailForm } from '../../../../interfaces/SFormData';
import styles from './ProposalHistory.module.scss';
import Step from './Step';
import moment from 'moment';

interface Props {
  proposalInfo?: ProposalDetailForm;
}
const cx = classNames.bind(styles);

const ProposalHistory: React.FC<Props> = ({ proposalInfo }) => {
  return (
    <div className={cx('proposal-history')}>
      <div className={cx('history-title')}>Proposal </div>
      <div className={cx('history-content')}>
        <Step
          title="Created"
          description={
            proposalInfo?.created_timestamp
              ? moment(proposalInfo.created_timestamp * 1000).format('LLL')
              : ''
          }
          unCheck={proposalInfo?.createdAt ? false : true}
        />
        <Step
          title="Active"
          description={
            proposalInfo?.startTimestamp
              ? moment(proposalInfo.startTimestamp * 1000).format('LLL')
              : ''
          }
          unCheck={proposalInfo?.startTimestamp ? false : true}
        />
        <Step
          title={
            proposalInfo?.state === 'Canceled' || proposalInfo?.state === 'Defeated'
              ? proposalInfo.state === 'Defeated'
                ? 'Failed'
                : 'Canceled'
              : `${proposalInfo?.state === 'Successded' ? 'Succeeded' : 'Succeed'}`
          }
          description={
            proposalInfo?.endTimestamp ? moment(proposalInfo.endTimestamp * 1000).format('LLL') : ''
          }
          unCheck={proposalInfo?.endTimestamp ? false : true}
        />
        <Step
          title={`${
            proposalInfo?.state === 'Queued' || proposalInfo?.state === 'Executed'
              ? 'Queued'
              : 'Queue'
          }`}
          description={
            proposalInfo?.queued_timestamp
              ? moment(proposalInfo.queued_timestamp * 1000).format('LLL')
              : ''
          }
          unCheck={proposalInfo?.queued_timestamp || proposalInfo?.state === 'Queued' ? false : true}
        />
        <Step
          title={
            proposalInfo?.state === 'Expired'
              ? proposalInfo.state
              : `${proposalInfo?.state === 'Executed' ? 'Executed' : 'Execute'}`
          }
          description={
            proposalInfo?.executed_timestamp
              ? moment(proposalInfo.executed_timestamp * 1000).format('LLL')
              : ''
          }
          unCheck={
            proposalInfo?.executed_timestamp || proposalInfo?.state === 'Executed' ? false : true
          }
        />
      </div>
    </div>
  );
};
export default ProposalHistory;
