import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import styles from '../styles/SendMoney.module.css';

const SendMoney = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock send logic
        console.log('Sending', amount, 'to', recipient);
        navigate('/dashboard');
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h2 className={styles.title}>Send Money</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Recipient (Email or Phone)</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.inputIcon} size={20} />
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Enter recipient details"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Amount (₦)</label>
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
                        <Send size={18} style={{ marginRight: '8px' }} /> Send Money
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default SendMoney;
