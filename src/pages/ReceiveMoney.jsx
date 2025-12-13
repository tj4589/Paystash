import React, { useState } from 'react';
import { QrCode, Copy, Share2, WifiOff } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import styles from '../styles/ReceiveMoney.module.css';

const ReceiveMoney = () => {
    const [amount, setAmount] = useState('');
    const [generated, setGenerated] = useState(false);

    const handleGenerate = (e) => {
        e.preventDefault();
        setGenerated(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h2 className={styles.title}>Receive Money</h2>

                {!generated ? (
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Amount to Receive (₦)</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.currencySymbol}>₦</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <QrCode size={18} style={{ marginRight: '8px' }} /> Generate QR Code
                        </button>
                    </form>
                ) : (
                    <div className={styles.qrSection}>
                        <div className={styles.qrCard}>
                            <div className={styles.qrHeader}>
                                <span className={styles.amount}>₦{parseFloat(amount).toLocaleString()}</span>
                                <div className={styles.badge}>
                                    <WifiOff size={12} /> Offline Token
                                </div>
                            </div>

                            <div className={styles.qrPlaceholder}>
                                {/* Placeholder for actual QR code */}
                                <QrCode size={120} color="#0a192f" />
                            </div>

                            <div className={styles.tokenInfo}>
                                <p>Token ID: 9f8d3a23-4c2b...</p>
                                <p className={styles.expiry}>Expires in 5:59</p>
                            </div>

                            <div className={styles.actions}>
                                <button className="btn btn-outline" onClick={() => setGenerated(false)}>
                                    New Code
                                </button>
                                <button className="btn btn-primary">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ReceiveMoney;
