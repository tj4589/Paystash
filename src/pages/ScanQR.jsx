import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import styles from '../styles/ScanQR.module.css';

const ScanQR = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        // Mock scanning process
        const timer = setTimeout(() => {
            setScanning(false);
            // In a real app, we would decode the QR here
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.cameraView}>
                    {scanning ? (
                        <>
                            <div className={styles.overlay}>
                                <div className={styles.scanFrame}></div>
                                <p className={styles.instruction}>Align QR code within the frame</p>
                            </div>
                            <div className={styles.cameraMock}>
                                <Camera size={48} className={styles.cameraIcon} />
                                <span>Camera Active</span>
                            </div>
                        </>
                    ) : (
                        <div className={styles.result}>
                            <h3>Token Scanned!</h3>
                            <p>Paying ₦5,000.00 to Merchant</p>
                            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                                Confirm Payment
                            </button>
                        </div>
                    )}
                    <button className={styles.closeBtn} onClick={() => navigate('/dashboard')}>
                        <X size={24} />
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ScanQR;
