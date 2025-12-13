import React, { useState } from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import styles from '../styles/TopUp.module.css';

const TopUp = () => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('card');

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h2 className={styles.title}>Top Up Account</h2>

                <div className={styles.card}>
                    <div className={styles.section}>
                        <label>Amount to Add</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.currencySymbol}>₦</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label>Payment Method</label>
                        <div className={styles.methods}>
                            <button
                                className={`${styles.methodBtn} ${method === 'card' ? styles.active : ''}`}
                                onClick={() => setMethod('card')}
                            >
                                <CreditCard size={24} />
                                <span>Card</span>
                            </button>
                            <button
                                className={`${styles.methodBtn} ${method === 'ussd' ? styles.active : ''}`}
                                onClick={() => setMethod('ussd')}
                            >
                                <Smartphone size={24} />
                                <span>USSD</span>
                            </button>
                            <button
                                className={`${styles.methodBtn} ${method === 'bank' ? styles.active : ''}`}
                                onClick={() => setMethod('bank')}
                            >
                                <Building size={24} />
                                <span>Bank</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.summary}>
                        <div className={styles.row}>
                            <span>Amount</span>
                            <span>₦{amount || '0.00'}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Fee</span>
                            <span>₦0.00</span>
                        </div>
                        <div className={`${styles.row} ${styles.total}`}>
                            <span>Total</span>
                            <span>₦{amount || '0.00'}</span>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }}>
                        Pay with Interswitch
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TopUp;
