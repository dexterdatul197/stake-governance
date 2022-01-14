import classNames from 'classnames/bind';
import { BigNumber as BigNumber0x } from '@0x/utils';
import { message, Tooltip } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from 'src/store/hooks';
import Web3 from 'web3';
import { getProposalDetail, getVotes } from '../../../../apis/apis';
import AddressArrowSVG from '../../../../assets/icon/AddressArrowSVG';
import { currentAddress, getStatus } from '../../../../helpers/common';
import {
  ethAddressPage,
  getCHNBalance,
  governance,
  methods,
  stakingToken
} from '../../../../helpers/ContractService';
import { ProposalDetailForm, VoteFormData } from '../../../../interfaces/SFormData';
import BackArrow from '../../../back-arrow/BackArrow';
import ProposalHistory from '../proposal-history/ProposalHistory';
import VoteCard from '../vote-card/VoteCard';
import styles from './ProposalDetail.module.scss';
import Button from '@material-ui/core/Button';
import Icon from '@ant-design/icons/lib/components/Icon';
import { isConnected } from '../../../../helpers/connectWallet';
import { setVotingWeight } from '../../redux/Governance';
import { useDispatch } from 'react-redux';
const cx = classNames.bind(styles);
interface Props {
  proposalId: number;
  match?: any;
}
const ProposalDetail: React.FC<Props> = (props) => {
  const [forVotes, setForVotes] = useState<VoteFormData>({
    totalVotes: 0,
    percent: '',
    type: '',
    votes: [],
    sumVotes: ''
  });
  const [againstVotes, setAgainstVotes] = useState<VoteFormData>({
    totalVotes: 0,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [cancelStatus, setCancelStatus] = useState('pending');
  const [proposalThreshold, setProposalThreshold] = useState(0);
  const [proposerVotingWeight, setProposerVotingWeight] = useState(0);
  const [isPossibleExcuted, setIsPossibleExcuted] = useState(false);
  const [excuteEta, setExcuteEta] = useState('');
  const [limitUpVote, setLimitUpVote] = useState(4);
  const [limitDownVote, setLimitDownVote] = useState(4);
  const dispatch = useDispatch();
  const wallet = useAppSelector((state) => state.wallet);

  const getBalanceOf = async () => {
    if (isConnected(wallet)) {
      const connectedAddress = currentAddress(wallet);
      const contract = await stakingToken();
      const chnAmount = await contract.userInfo(0, connectedAddress);
      const formatValueStake = new BigNumber0x(chnAmount.amount).div(1e18);
      dispatch(setVotingWeight(formatValueStake.toFixed(4).toString()));
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getBalanceOf();
  }, [isConnected(wallet)]);

  const votingWeight = useAppSelector((state) => state.governance.voteingWeight);

  const callbackViewAllUpVote = (childData: number) => {
    setLimitUpVote(childData);
  };
  const callbackViewAllDownVote = (childData: number) => {
    setLimitDownVote(childData);
  };
  const updateBalance = useCallback(async () => {
    if (wallet.ethereumAddress && proposalDetail.id) {
      const voteContract = await governance();
      await methods.call(voteContract.proposalThreshold, []).then((res: any) => {
        setProposalThreshold(+Web3.utils.fromWei(res, 'ether'));
      });
      setProposerVotingWeight(+votingWeight);
    }
  }, [wallet.ethereumAddress, proposalDetail, votingWeight]);

  useEffect(() => {
    if (wallet.ethereumAddress) {
      updateBalance();
    }
  }, [wallet.ethereumAddress, updateBalance, votingWeight]);
  const getIsPossibleExcuted = async () => {
    const voteContract = await governance();
    methods.call(voteContract.proposals, [proposalDetail.id]).then((res: any) => {
      setIsPossibleExcuted(res && res.eta <= Date.now() / 1000);
      setExcuteEta(moment(res.eta * 1000).format('LLLL'));
    });
  };
  useEffect(() => {
    if (proposalDetail.id) {
      getIsPossibleExcuted();
    }
  }, [proposalDetail]);

  const handleUpdateProposal = async (statusType: string) => {
    const appContract = await governance();
    if (statusType === 'Queue') {
      setIsLoading(true);
      methods
        .send(appContract.queue, [proposalDetail.id], wallet.ethereumAddress)
        .then(() => {
          setIsLoading(false);
          setStatus('success');
          message.success(`Proposal list will update within a few seconds`);
        })
        .catch(() => {
          setIsLoading(false);
          setStatus('failure');
        });
    } else if (statusType === 'Execute') {
      setIsLoading(true);
      methods
        .send(appContract.execute, [proposalDetail.id], wallet.ethereumAddress)
        .then((res) => {
          setIsLoading(false);
          setStatus('success');
          message.success(`Proposal list will update within a few seconds`);
        })
        .catch((err) => {
          setIsLoading(false);
          setStatus('failure');
        });
    } else if (statusType === 'Cancel') {
      setIsCancelLoading(true);
      methods
        .send(appContract.cancel, [proposalDetail.id], wallet.ethereumAddress)
        .then(() => {
          setIsCancelLoading(false);
          setCancelStatus('success');
          message.success(
            `Current proposal is cancelled successfully. Proposal list will update within a few seconds`
          );
        })
        .catch(() => {
          setIsCancelLoading(false);
          setCancelStatus('failure');
        });
    }
  };

  const getProposal = async () => {
    const proposalDetail = await getProposalDetail(props.match.params.proposalId);
    const forVotes = await getVotes(props.match.params.proposalId, true, limitUpVote);
    const againstVotes = await getVotes(props.match.params.proposalId, false, limitDownVote);

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
      totalVotes: forVotes.metadata.totalItem,
      percent: forPercent.toFixed(10),
      type: 'Up Vote',
      votes: forVotes.data,
      sumVotes: forVotes.metadata.sumVotes
    });
    setAgainstVotes({
      totalVotes: againstVotes.metadata.totalItem,
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
  }, [limitUpVote, limitDownVote, status]);
  return (
    <div className={cx('proposal-detail')}>
      <BackArrow title="Detail" />
      <div className={cx('title', 'text-black-white')}>{proposalDetail.title}</div>
      <div className={cx('proposal-block')}>
        <div className={cx('block-left')}>
          <div className={cx('proposer-id', 'pd-td-10')}>
            <div>{proposalDetail.proposer}</div>
            <div
              className={cx('proposer-id-icon')}
              onClick={() => goToEthereumAddress(proposalDetail.proposer)}>
              <AddressArrowSVG />
            </div>
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
              )}>
              {getStatus(proposalDetail.state)}
            </div>
          </div>
          <div className={cx('detail-info')}>
            <div className={cx('vote-card')}>
              <VoteCard voting={forVotes} parrentCallback={callbackViewAllUpVote} />
            </div>
            <div className={cx('vote-card')}>
              <VoteCard voting={againstVotes} parrentCallback={callbackViewAllDownVote} />
            </div>
          </div>
        </div>
        <div className={cx('block-right')}>
          <ProposalHistory proposalInfo={proposalDetail} />
        </div>
      </div>
      <div className={cx('vote-status-update')}>
        {proposalDetail.state !== 'Executed' &&
          proposalDetail.state !== 'Defeated' &&
          proposalDetail.state !== 'Canceled' && (
            <div className={cx('update-proposal-status')}>
              <Button
                className={cx('cancel-btn')}
                disabled={
                  isCancelLoading ||
                  proposerVotingWeight >= proposalThreshold ||
                  cancelStatus === 'success'
                }
                onClick={() => handleUpdateProposal('Cancel')}>
                {isCancelLoading && <Icon type="loading" />}{' '}
                {cancelStatus === 'pending' || cancelStatus === 'failure' ? 'Cancel' : 'Cancelled'}
              </Button>
              {proposalDetail.state === 'Successded' && (
                <Button
                  className={cx('queud-btn')}
                  disabled={isLoading || status === 'success'}
                  onClick={() => handleUpdateProposal('Queue')}>
                  {isLoading && <Icon type="loading" />}{' '}
                  {status === 'pending' || status === 'failure' ? 'Queue' : 'Queued'}
                </Button>
              )}
              {proposalDetail.state === 'Queued' && !proposalDetail.executedTimestamp && (
                <Button
                  className={cx('execute-btn')}
                  disabled={isLoading || status === 'success' || !isPossibleExcuted}
                  onClick={() => handleUpdateProposal('Execute')}>
                  {isLoading && <Icon type="loading" />}{' '}
                  {status === 'pending' || status === 'failure' ? 'Execute' : 'Executed'}
                </Button>
              )}
              {proposalDetail.state === 'Queued' && !isPossibleExcuted && (
                <Tooltip title={`You are able to excute at ${excuteEta}`}>
                  <Icon className="pointer" type="info-circle" />
                </Tooltip>
              )}
            </div>
          )}
        {proposalDetail.state !== 'Executed' &&
          proposalDetail.state !== 'Defeated' &&
          proposalDetail.state !== 'Canceled' &&
          proposerVotingWeight >= proposalThreshold && (
            <p className={cx('center-warning')}>
              You can not cancel the proposal while the proposer voting weight meets proposal
              threshold
            </p>
          )}
      </div>
      <div className={cx('description')}>
        <div className={cx('text-black-white')}>Description</div>
        <div className={cx('description-value')}>{proposalDetail.description}</div>
      </div>
    </div>
  );
};
export default ProposalDetail;
