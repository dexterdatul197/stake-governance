import classNames from "classnames/bind";
import styles from './Proposal.module.scss'
import React from "react";
const cx = classNames.bind(styles)
const Proposal: React.FC = () => {
    return (
        <div className={cx('governance-proposal')}>
            <div className={cx('text-header')}>Proposal</div>
        </div>
    )
}
export default Proposal;