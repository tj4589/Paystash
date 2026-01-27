import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { CryptoService } from '../services/CryptoService';
import { supabase } from '../lib/supabase';

export const usePaystashStore = create(
    persist(
        (set, get) => ({
            // State
            user: null, // NEW: Auth User
            walletBalance: 0.00,
            offlineBalance: 0.00,
            isOffline: false,
            isSyncing: false,
            keys: null, // { publicKey, secretKey }
            transactions: [],
            pendingSync: [],

            // Actions
            setOffline: (status) => set({ isOffline: status }),
            setSyncing: (status) => set({ isSyncing: status }),

            // Auth Actions
            login: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Fetch Profile & Balance
                if (data.user) {
                    set({ user: data.user });
                    await get().fetchProfile();
                }
                return data;
            },

            signup: async (email, password, metadata) => {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: metadata }
                });
                if (error) throw error;
                if (data.user) {
                    set({ user: data.user });
                    // Create Profile Row if needed (Trigger usually handles this, or do it here)
                }
                return data;
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, walletBalance: 0, transactions: [] });
            },

            fetchProfile: async () => {
                const { user } = get();
                if (!user) return;

                // 1. Get Profile (Balance)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    set({ walletBalance: parseFloat(profile.balance || 0) });
                }

                // 2. Get Transactions
                const { data: txs } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (txs) {
                    set({
                        transactions: txs.map(t => ({
                            id: t.id,
                            title: t.title || 'Transaction',
                            amount: parseFloat(t.amount),
                            date: t.created_at,
                            type: t.type,
                            status: t.status
                        }))
                    });
                }
            },

            initKeys: async () => {
                // Check for existing session
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    set({ user: session.user });
                    get().fetchProfile();
                }

                const keys = await CryptoService.getOrCreateKeyPair();
                set({ keys });
            },

            // --- Core Actions (Payer-Generated Flow) ---

            // Payer: Generates QR, Locks Funds
            generatePaymentCredential: (amount, recipientId) => {
                const state = get();
                const numericAmount = parseFloat(amount);

                if (!state.keys) {
                    return { success: false, error: 'Security Keys not initialized. Restart App.' };
                }

                if (state.isOffline && numericAmount > state.offlineBalance) {
                    // Offline balance check if applicable
                }

                if (numericAmount > state.walletBalance) {
                    return { success: false, error: 'Insufficient balance' };
                }


                // Lock Funds
                const newTransaction = {
                    id: Date.now().toString(),
                    type: 'debit',
                    title: `Payment to ${recipientId}`,
                    amount: -numericAmount,
                    date: new Date().toISOString(),
                    status: 'locked', // Payer waits for sync or scan
                    recipientId: recipientId
                };

                const transactionData = {
                    type: 'paystash-payment',
                    id: newTransaction.id,
                    amount: numericAmount,
                    recipientId: recipientId,
                    payerId: 'user-payer-123', // In real app, from auth
                    expiresAt: Date.now() + 5 * 60 * 1000,
                    payerPublicKey: state.keys.publicKey // Embed Public Key for Self-Contained Verification
                };

                // Sign the Data
                const signature = CryptoService.sign(transactionData, state.keys.secretKey);

                const finalPayload = JSON.stringify({
                    data: transactionData,
                    signature: signature
                });

                set((state) => ({
                    walletBalance: state.walletBalance - numericAmount, // Deduct immediately
                    // lockedBalance: state.lockedBalance + numericAmount, // If we tracked locked separately
                    transactions: [newTransaction, ...state.transactions],
                    pendingSync: [...state.pendingSync, newTransaction.id]
                }));

                return { success: true, payload: finalPayload };
            },

            // Payer: Cancel generated QR (Unlock)
            cancelPaymentCredential: (txId) => {
                const state = get();
                const tx = state.transactions.find(t => t.id === txId);

                if (!tx || tx.status !== 'locked') return { success: false, error: 'Transaction not found or not locked' };

                const refundAmount = Math.abs(tx.amount);

                set((state) => ({
                    walletBalance: state.walletBalance + refundAmount,
                    transactions: state.transactions.filter(t => t.id !== txId), // Remove the locked tx or mark as cancelled
                    pendingSync: state.pendingSync.filter(id => id !== txId)
                }));
                return { success: true };
            },

            // Receiver: Scans Payer's QR
            processPaymentScan: async (scannedPayload) => {
                const state = get();

                let parsedPayload;
                try {
                    parsedPayload = typeof scannedPayload === 'string' ? JSON.parse(scannedPayload) : scannedPayload;
                } catch (e) {
                    return { success: false, error: 'Invalid QR Format' };
                }

                const { data, signature } = parsedPayload;

                if (!data || !signature || data.type !== 'paystash-payment') {
                    return { success: false, error: 'Invalid Payment QR' };
                }

                // Verify Signature
                const isValid = CryptoService.verify(data, signature, data.payerPublicKey);

                if (!isValid) {
                    return { success: false, error: 'SECURITY ALERT: Payment Signature Invalid! Data may have been tampered with.' };
                }

                const { amount, id } = data;

                // Prevent processing same transaction twice locally
                if (state.transactions.find(t => t.id === id)) {
                    return { success: false, error: 'Transaction already processed' };
                }

                const newTransaction = {
                    id: id, // Use Payer's Tx ID for reconciliation match
                    type: 'credit',
                    title: `Payment from Payer`,
                    amount: parseFloat(amount),
                    date: new Date().toISOString(),
                    status: state.isOffline ? 'pending-sync' : 'finalized'
                };

                if (state.isOffline) {
                    // Offline: Add to Pending (Show in UI)
                    set((state) => ({
                        transactions: [newTransaction, ...state.transactions],
                        pendingSync: [...state.pendingSync, newTransaction] // Store full object for sync
                    }));
                    return { success: true, status: 'offline' };

                } else {
                    // Online: Push to Supabase
                    const { error } = await supabase.from('transactions').insert({
                        id: newTransaction.id,
                        sender_id: data.payerId, // We might not know this ID if anonymous, but assuming standard flow
                        recipient_id: state.user?.id,
                        amount: newTransaction.amount,
                        type: 'credit',
                        status: 'completed',
                        title: newTransaction.title,
                        signature: signature,
                        metadata: { original_data: data }
                    });

                    if (error) {
                        console.error("Supabase payment save failed", error);
                        // Fallback to offline holding pattern?
                        return { success: false, error: 'Network Error saving payment' };
                    }

                    // Optimistic UI Update
                    set((state) => ({
                        walletBalance: state.walletBalance + parseFloat(amount),
                        transactions: [newTransaction, ...state.transactions],
                    }));
                    return { success: true, status: 'online' };
                }
            },

            receiveMoney: (amount, fromUser) => {
                // ... (Legacy direct receive, kept for compatibility if needed, or can be deprecated)
                return { success: true };
            },

            // Top Up Action
            topUp: async (amount, method = 'card') => {
                const state = get();
                const numericAmount = parseFloat(amount);

                // 1. Update Local State (Optimistic)
                const newTransaction = {
                    id: uuidv4(),
                    title: `Top Up via ${method}`,
                    amount: numericAmount,
                    type: 'topup',
                    date: new Date().toISOString(),
                    status: 'completed'
                };

                set((state) => ({
                    walletBalance: state.walletBalance + numericAmount,
                    transactions: [newTransaction, ...state.transactions]
                }));

                // 2. Persist to Supabase
                const { error } = await supabase.from('transactions').insert({
                    id: newTransaction.id,
                    recipient_id: state.user?.id,
                    amount: numericAmount,
                    type: 'topup',
                    status: 'completed',
                    title: newTransaction.title,
                    metadata: { method }
                });

                if (error) {
                    console.error('TopUp Sync Failed', error);
                    // Optionally revert logic or mark as pending-sync
                }

                // Update Profile Balance in DB
                if (state.user) {
                    await supabase.from('profiles').upsert({
                        id: state.user.id,
                        balance: state.walletBalance + numericAmount // Note: verify concurrency in real app
                    });
                }
            },

            // Withdraw/Add Transaction Action
            addTransaction: async (txData) => {
                const state = get();
                const amount = parseFloat(txData.amount); // Should be negative for withdrawal

                const newTransaction = {
                    id: uuidv4(),
                    title: txData.title,
                    amount: amount,
                    type: txData.type || 'debit',
                    date: new Date().toISOString(),
                    status: txData.status || 'completed'
                };

                // Optimistic Update
                set((state) => ({
                    walletBalance: state.walletBalance + amount,
                    transactions: [newTransaction, ...state.transactions]
                }));

                // Persist
                const { error } = await supabase.from('transactions').insert({
                    id: newTransaction.id,
                    sender_id: state.user?.id,
                    amount: Math.abs(amount), // DB usually stores positive with type
                    type: newTransaction.type,
                    status: 'completed',
                    title: newTransaction.title,
                });

                if (error) {
                    console.error('Withdraw Sync Failed', error);
                }

                // Update Profile Balance in DB
                if (state.user) {
                    const currentBal = state.walletBalance; // Post-optimistic update
                    await supabase.from('profiles').upsert({
                        id: state.user.id,
                        balance: currentBal
                    });
                }
            },

            // ... (Rest of sync logic)
            // Sync logic
            processPendingSync: async () => {
                const state = get();
                if (state.pendingSync.length === 0) return;

                set({ isSyncing: true });

                // Push all pending transactions to Supabase
                const failed = [];
                for (const tx of state.pendingSync) {
                    // Determine if it's a "Credit" we scanned or a "Debit" we made?
                    // For MVP, assuming Receiver usage predominantly for "Sync"
                    const { error } = await supabase.from('transactions').upsert({
                        id: tx.id,
                        amount: tx.amount,
                        type: tx.type,
                        status: 'completed',
                        created_at: tx.date
                    });

                    if (error) failed.push(tx);
                }

                set((state) => {
                    // Remove successful ones from pendingSync
                    // Update status of those in main list
                    const remainingIds = failed.map(t => t.id);
                    const updatedTransactions = state.transactions.map(t =>
                        !remainingIds.includes(t.id) && state.pendingSync.some(p => p.id === t.id)
                            ? { ...t, status: 'confirmed' }
                            : t
                    );

                    return {
                        transactions: updatedTransactions,
                        pendingSync: failed,
                        isSyncing: false
                    };
                });
            }
        }),
        {
            name: 'paystash-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.initKeys();
            }
        }
    )
);
