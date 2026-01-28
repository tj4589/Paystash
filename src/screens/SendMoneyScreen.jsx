import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const SendMoneyScreen = () => {
    const navigation = useNavigation();
    const { sendMoney, walletBalance } = usePaystashStore();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');

    const handleSend = async () => {
        if (!email || !amount) {
            alert('Please fill in all fields');
            return;
        }

        if (parseFloat(amount) > walletBalance) {
            alert('Insufficient balance');
            return;
        }

        setLoading(true);
        try {
            await sendMoney(email, amount);
            alert(`Successfully sent ₦${amount} to ${email}`);
            navigation.goBack();
        } catch (error) {
            alert(error.message || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <Header showBack={true} title="Send Money" />
            <View style={styles.content}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Recipient Email"
                        placeholder="recipient@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Input
                        label="Amount (₦)"
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />

                    <Button
                        title="Send Money"
                        onPress={handleSend}
                        loading={loading}
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
        flex: 1,
    },
    balanceContainer: {
        marginBottom: THEME.SPACING.xl,
        alignItems: 'center',
        padding: THEME.SPACING.lg,
        backgroundColor: THEME.COLORS.bgCard,
        borderRadius: THEME.RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(0, 85, 255, 0.1)',
    },
    balanceLabel: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.sm,
        marginBottom: THEME.SPACING.xs,
        fontFamily: THEME.FONTS.sans,
    },
    balanceAmount: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES['2xl'],
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    form: {
        gap: THEME.SPACING.md,
    },
    button: {
        marginTop: THEME.SPACING.lg,
    }
});

export default SendMoneyScreen;
