import classNames from "classnames/bind";
import React from "react";
import ArrowLeftSVG from "../../assets/icon/ArrowLeftSVG";
import styles from './BackArrow.module.scss';
interface Props {
    title?: string;
}
const cx = classNames.bind(styles);
const BackArrow: React.FC<Props> = ({ title = '' }) => {
    return (
        <div className={cx('back-arrow')}>
            <div className={cx('arrow-left')}>
                <ArrowLeftSVG />
            </div>
            <div>{title}</div>
        </div>
    )
}
export default BackArrow;