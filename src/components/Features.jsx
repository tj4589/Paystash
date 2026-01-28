import React from 'react';
import { WifiOff, QrCode, RefreshCw, CreditCard, History, ShieldCheck } from 'lucide-react';
import styles from '../styles/Features.module.css';

const features = [
    {
        icon: <WifiOff size={24} />,
        title: 'Offline Payments',
        description: 'Send and receive money without an internet connection using secure offline tokens.'
    },
    {
        icon: <QrCode size={24} />,
        title: 'Instant QR Scan',
        description: 'Generate and scan QR codes instantly. No typing, no errors, just scan and go.'
    },
    {
        icon: <RefreshCw size={24} />,
        title: 'Auto-Reconciliation',
        description: 'Transactions sync automatically as soon as your device connects to the internet.'
    },
    {
        icon: <CreditCard size={24} />,
        title: 'Easy Top-Up',
        description: 'Fund your wallet directly from your bank account via Interswitch.'
    },
    {
        icon: <History size={24} />,
        title: 'Transaction History',
        description: 'Keep track of all your spending, both online and offline, in one unified view.'
    },
    {
        icon: <ShieldCheck size={24} />,
        title: 'Secure & Safe',
        description: 'Bank-grade security ensures your funds and data are always protected.'
    }
];

const Features = () => {
    return (
        <section className={styles.features} id="features">
            <div className="container">
                <div className="text-center">
                    <h2 className={styles.title}>Why Choose PayStash?</h2>
                    <p className={styles.subtitle}>The future of payments is here, and it works everywhere.</p>
                </div>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
