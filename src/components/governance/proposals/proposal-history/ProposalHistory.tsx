import classNames from "classnames/bind";
import React from "react";
import { ProposalDetailForm } from "../../../../interfaces/SFormData";
import styles from './ProposalHistory.module.scss';

interface Props {
    proposalInfo?: ProposalDetailForm
}
const cx = classNames.bind(styles);

const ProposalHistory:React.FC<Props> = ({proposalInfo}) => {
    console.log('Proposal history:', proposalInfo);
    
    return (
        <div className={cx('proposal-history')}>
            <p className='text-black-white'>Proposal History</p>
        </div>
    )
}
export default ProposalHistory;