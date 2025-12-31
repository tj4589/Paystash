import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Home, Send, Download, History, Settings, LogOut, PlusCircle } from 'lucide-react';
import styles from '../styles/DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <QrCode className={styles.logoIcon} />
                    <span>PayStash</span>
                </div>

                <nav className={styles.nav}>
                    <Link to="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/send" className={`${styles.navItem} ${isActive('/send') ? styles.active : ''}`}>
                        <Send size={20} /> Send Money
                    </Link>
                    <Link to="/receive" className={`${styles.navItem} ${isActive('/receive') ? styles.active : ''}`}>
                        <Download size={20} /> Receive
                    </Link>
                    <Link to="/transactions" className={`${styles.navItem} ${isActive('/transactions') ? styles.active : ''}`}>
                        <History size={20} /> History
                    </Link>
                    <Link to="/topup" className={`${styles.navItem} ${isActive('/topup') ? styles.active : ''}`}>
                        <PlusCircle size={20} /> Top Up
                    </Link>
                </nav>

                <div className={styles.footer}>
                    <Link to="/settings" className={styles.navItem}>
                        <Settings size={20} /> Settings
                    </Link>
                    <Link to="/" className={styles.navItem}>
                        <LogOut size={20} /> Logout
                    </Link>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>JD</div>
                        <span className={styles.userName}>John Doe</span>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
