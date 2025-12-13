import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/CTA.module.css';

const CTA = () => {
    return (
        <section className={styles.cta}>
            <div className="container">
                <div className={styles.content}>
                    <h2 className={styles.title}>Ready to go cashless?</h2>
                    <p className={styles.description}>
                        Join thousands of users who are experiencing the freedom of offline payments today.
                    </p>
                    <Link to="/signup" className="btn btn-primary">Create Free Account</Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
