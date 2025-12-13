import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo}>
                    <QrCode className={styles.logoIcon} />
                    <span>PayStash</span>
                </Link>
                <nav className={styles.nav}>
                    <Link to="/login" className="btn btn-outline">Log In</Link>
                    <Link to="/signup" className="btn btn-primary">Get Started</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
