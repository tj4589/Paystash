import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import styles from '../styles/Auth.module.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock signup logic
        console.log('Signup data:', formData);
        navigate('/dashboard');
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join PayStash and start paying offline today."
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="agreeTerms">
                        I agree to the <Link to="/terms">Terms & Conditions</Link>
                    </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Create Account
                </button>

                <p className={styles.footerText}>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
