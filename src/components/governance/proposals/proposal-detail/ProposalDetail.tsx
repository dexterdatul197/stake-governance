import classNames from 'classnames/bind';
import { BigNumber } from 'ethers';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getProposalDetail, getVotes } from '../../../../apis/apis';
import AddressArrowSVG from '../../../../assets/icon/AddressArrowSVG';
import { getStatus } from '../../../../helpers/common';
import { ethAddressPage } from '../../../../helpers/ContractService';
import { ProposalDetailForm, VoteFormData } from '../../../../interfaces/SFormData';
import BackArrow from '../../../back-arrow/BackArrow';
import ProposalHistory from '../proposal-history/ProposalHistory';
import VoteCard from '../vote-card/VoteCard';
import styles from './ProposalDetail.module.scss';
const cx = classNames.bind(styles);
interface Props {
  proposalId: number;
  match?: any;
}
const ProposalDetail: React.FC<Props> = (props) => {
  const [forVotes, setForVotes] = useState<VoteFormData>({
    percent: '',
    type: '',
    votes: [],
    sumVotes: ''
  });
  const [againstVotes, setAgainstVotes] = useState<VoteFormData>({
    percent: '',
    type: '',
    votes: [],
    sumVotes: ''
  });
  const [proposalDetail, setProposalDetail] = useState<ProposalDetailForm>({
    againstVotes: '',
    callDatas: [],
    cancelBlock: 0,
    cancelTimestamp: 0,
    cancelTxHash: '',
    canceled: false,
    createdAt: '',
    createdBlock: 0,
    createdTimestamp: 0,
    createdTxHash: '',
    description: '',
    endBlock: 0,
    endTimestamp: 0,
    endTxHash: '',
    eta: 0,
    executed: false,
    executedBlock: 0,
    executedTimestamp: 0,
    executedTxHash: '',
    forVotes: '',
    id: 0,
    params: '',
    proposalId: 0,
    proposer: '',
    queuedBlock: 0,
    queuedTimestamp: 0,
    queuedTxHash: '',
    signatures: [],
    startBlock: 0,
    startTimestamp: 0,
    startTxHash: '',
    state: '',
    targets: [],
    title: '',
    updatedAt: '',
    values: [],
    voterCount: ''
  });

  const getProposal = async () => {
    const proposalDetail = await getProposalDetail(props.match.params.proposalId);
    const forVotes = await getVotes(props.match.params.proposalId, true);
    const againstVotes = await getVotes(props.match.params.proposalId, false);

    const total =
      Number(forVotes.metadata.sumVotes || '0') + Number(againstVotes.metadata.sumVotes || '0');

    const forPercent = isNaN((Number(forVotes.metadata.sumVotes || '0') * 100) / total)
      ? 0
      : (Number(forVotes.metadata.sumVotes || '0') * 100) / total;

    const againstPercent = isNaN((Number(againstVotes.metadata.sumVotes || '0') * 100) / total)
      ? 0
      : (Number(againstVotes.metadata.sumVotes || '0') * 100) / total;

    setProposalDetail(proposalDetail.data);
    setForVotes({
      percent: forPercent.toFixed(10),
      type: 'Up Vote',
      votes: forVotes.data,
      sumVotes: forVotes.metadata.sumVotes
    });
    setAgainstVotes({
      percent: againstPercent.toFixed(10),
      type: 'Down Vote',
      votes: againstVotes.data,
      sumVotes: againstVotes.metadata.sumVotes
    });
  };

  const goToEthereumAddress = (address: string) => {
    window.open(`${ethAddressPage()}/${address}`, '_blank');
  };

  useEffect(() => {
    getProposal();
  }, []);

  return (
    <div className={cx('proposal-detail')}>
      <BackArrow title="Detail" />
      <div className={cx('title', 'text-black-white')}>{proposalDetail.title}</div>
      <div className={cx('proposal-block')}>
        <div className={cx('block-left')}>
          <div
            className={cx('proposer-id', 'pd-td-10')}
            onClick={() => goToEthereumAddress(proposalDetail.proposer)}
          >
            {proposalDetail.proposer} <AddressArrowSVG />
          </div>
          <div className={cx('proposer-status')}>
            <div className={cx('proposer-status-left')}>
              <div>{proposalDetail.id}</div>
              <div className={cx('proposer-status-left-date')}>
                {moment(proposalDetail.createdAt).format('MMMM Do, YYYY')}
              </div>
            </div>
            <div
              className={cx(
                `proposal-status-${getStatus(proposalDetail.state).toLowerCase()}`,
                'proposal-status'
              )}
            >
              {getStatus(proposalDetail.state)}
            </div>
          </div>
          <div className={cx('detail-info')}>
            <div className={cx('vote-card')}>
              <VoteCard props={forVotes} />
            </div>
            <div className={cx('vote-card')}>
              <VoteCard props={againstVotes} />
            </div>
          </div>
        </div>
        <div className={cx('block-right')}>
          <ProposalHistory proposalInfo={proposalDetail} />
        </div>
      </div>
      <div className={cx('description')}>
        <div className="text-black-white">Description</div>
        <p className="text-black-white">{proposalDetail.description}</p>
      </div>
    </div>
  );
};
export default ProposalDetail;
