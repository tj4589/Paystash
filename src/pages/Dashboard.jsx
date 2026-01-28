import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className={styles.grid}>
                {/* Balance Card */}
                <div className={styles.balanceCard}>
                    <div className={styles.balanceHeader}>
                        <span>Total Balance</span>
                        <Wallet size={20} className={styles.balanceIcon} />
                    </div>
                    <div className={styles.balanceAmount}>₦54,200.00</div>
                    <div className={styles.balanceFooter}>
                        <div className={styles.offlineBalance}>
                            <span className={styles.dot}></span>
                            <span>Offline Available: ₦20,000.00</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.actionsGrid}>
                    <Link to="/send" className={styles.actionCard}>
                        <div className={styles.actionIcon}><ArrowUpRight /></div>
                        <span>Send Money</span>
                    </Link>
                    <Link to="/receive" className={styles.actionCard}>
                        <div className={styles.actionIcon}><ArrowDownLeft /></div>
                        <span>Receive Money</span>
                    </Link>
                    <Link to="/scan" className={styles.actionCard}>
                        <div className={styles.actionIcon}><QrCode /></div>
                        <span>Scan QR</span>
                    </Link>
                    <Link to="/topup" className={styles.actionCard}>
                        <div className={styles.actionIcon}><Plus /></div>
                        <span>Top Up</span>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div className={styles.transactionsSection}>
                    <h2 className={styles.sectionTitle}>Recent Transactions</h2>
                    <div className={styles.transactionList}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.transactionItem}>
                                <div className={styles.transactionIcon}>
                                    <ArrowUpRight size={16} />
                                </div>
                                <div className={styles.transactionInfo}>
                                    <div className={styles.transactionTitle}>Transfer to Sarah</div>
                                    <div className={styles.transactionDate}>Today, 10:30 AM</div>
                                </div>
                                <div className={styles.transactionAmount}>-₦5,000.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
