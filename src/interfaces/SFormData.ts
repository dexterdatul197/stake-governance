export interface SFormData {
    targetAddress: string;
    value: string;
    signature: string;
    callData: any[]
}

export type Filter = {
    page?: number;
    limit?: number;
    startTime?: number;
    endTime?: number;
}

export interface ProposalFormData {
    id: number;
    description: string;
    params: string;
    canceled: number;
    executed: number;
    created_block: number;
    created_tx_hash: string;
    created_timestamp: number;
    start_block: number;
    start_tx_hash: string;
    start_timestamp: number;
    cancel_block: number;
    cancel_tx_hash: string;
    cancel_timestamp: number;
    end_block: number;
    end_tx_hash: string;
    end_timestamp: number;
    queued_block: number;
    queued_tx_hash: string;
    queued_timestamp: number;
    executed_block: number;
    executed_tx_hash: string;
    executed_timestamp: number;
    created_at: string;
    proposer: string;
    updated_at: string;
    title: string;
    values: string;
    signatures: string;
    call_datas: string;
    state: string;
    proposal_id: number;
    targets: string;
    for_votes: string;
    against_votes: string;
    eta: number
}

export interface ProposalDetailForm {
    againstVotes: string;
    callDatas: string[];
    cancelBlock: number;
    cancelTimestamp: number;
    cancelTxHash: string;
    canceled: boolean;
    createdAt: string;
    createdBlock: number;
    createdTimestamp: number;
    createdTxHash: string;
    description: string;
    endBlock: number;
    endTimestamp: number;
    endTxHash: string;
    eta: number;
    executed: boolean;
    executedBlock: number;
    executedTimestamp: number;
    executedTxHash: string;
    forVotes: string;
    id: number;
    params: string;
    proposalId: number;
    proposer: string;
    queuedBlock: number;
    queuedTimestamp: number;
    queuedTxHash: string;
    signatures: string[];
    startBlock: number;
    startTimestamp: number;
    startTxHash: string;
    state: string;
    targets: string[];
    title: string;
    updatedAt: string;
    values: string[];
    voterCount: string;
}