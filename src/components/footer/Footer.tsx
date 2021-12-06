import React from "react";
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const Footer: React.FC = () => {
    return (
        <div className={cx('footer-component')} >
            <div>&copy; Chain 1 open source</div>
            <div>vi.o\Block 275</div>
        </div>
    )
}
export default Footer;