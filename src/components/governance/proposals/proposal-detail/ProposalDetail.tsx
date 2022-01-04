import classNames from "classnames/bind";
import React from "react";
import BackArrow from "../../../back-arrow/BackArrow";
import styles from './ProposalDetail.module.scss';
const cx = classNames.bind(styles);
interface Props {
    proposalId?: number;
    match?: any
}
const ProposalDetail: React.FC<Props> = (props) => {
    
    return (
        <div className={cx('proposal-detail')}>
            <BackArrow title='Detail'/>
            Proposal Detail {props.match.params.proposalId}
        </div>
    )
}
export default ProposalDetail;