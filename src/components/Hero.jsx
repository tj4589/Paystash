import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, WifiOff } from 'lucide-react';
import styles from '../styles/Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <WifiOff size={16} />
                        <span>Offline-First Payments</span>
                    </div>
                    <h1 className={styles.headline}>
                        Send, Receive, and Pay Instantly — <span className={styles.highlight}>Online or Offline.</span>
                    </h1>
                    <p className={styles.subheadline}>
                        The seamless banking experience that works everywhere. Generate offline tokens, scan QR codes, and reconcile transactions automatically when you're back online.
                    </p>
                    <div className={styles.actions}>
                        <Link to="/signup" className="btn btn-primary">
                            Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                        <Link to="/features" className="btn btn-outline">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
