import classNames from "classnames/bind";
import React from "react";
import styles from './VoteCard.module.scss';
const cx = classNames.bind(styles);

const VoteCard:React.FC = () => {
    return (
        <div className={cx('vote-card')}>Vote Card</div>
    )
}
export default VoteCard;