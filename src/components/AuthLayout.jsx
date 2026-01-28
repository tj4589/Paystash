import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowLeft } from 'lucide-react';
import styles from '../styles/AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Link to="/" className={styles.backLink}>
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <div className={styles.logo}>
                        <QrCode className={styles.logoIcon} />
                        <span>PayStash</span>
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
