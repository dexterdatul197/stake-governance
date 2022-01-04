import classNames from "classnames/bind";
import React from "react";
import { useHistory } from "react-router-dom";
import ArrowLeftSVG from "../../assets/icon/ArrowLeftSVG";
import { useAppSelector } from "../../store/hooks";
import styles from './BackArrow.module.scss';
interface Props {
    title?: string;
}
const cx = classNames.bind(styles);
const BackArrow: React.FC<Props> = ({ title = '' }) => {
    const history = useHistory();
    const theme = useAppSelector((state) => state.theme.themeMode);
    const goToPreviousPath = () => {
        history.goBack();
    }
    return (
        <div className={cx('back-arrow')}>
            <div className={cx('arrow-left')} onClick={goToPreviousPath}>
                <ArrowLeftSVG color={theme === 'light' ? '#0D0D0D' : '#fff'}/>
            </div>
            <div className={cx('title')}>{title}</div>
        </div>
    )
}
export default BackArrow;