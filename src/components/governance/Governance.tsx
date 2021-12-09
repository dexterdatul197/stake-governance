import classNames from "classnames/bind";
import styles from './Governance.module.scss'
import React from "react";
import Vote from "./vote/Vote";
import Proposal from "./proposal/Proposal";
const cx = classNames.bind(styles)
const Governance: React.FC = () => {
    return (
        <div className={cx('governance')}>
            <Vote />
            <Proposal />
        </div>
    )
}
export default Governance;