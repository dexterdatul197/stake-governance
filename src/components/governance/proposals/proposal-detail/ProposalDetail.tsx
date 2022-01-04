import React from "react";
interface Props {
    proposalId?: number;
    match?: any
}
const ProposalDetail: React.FC<Props> = (props) => {
    
    return (
        <div>Proposal Detail {props.match.params.proposalId}</div>
    )
}
export default ProposalDetail;