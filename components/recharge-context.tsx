import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, errorMessage } from "../data/api";
import type { Account, ApiTransaction, AppConfig, RechargeRequest, Session } from "../data/api-types";
export type TransactionStatus = "Successful" | "Pending" | "Failed";
export type Transaction = Omit<ApiTransaction, "amount" | "created_at"> & { amount: number; date: string };
const mapTransaction = (row: ApiTransaction): Transaction => ({ ...row, amount: Number(row.amount), date: new Date(row.created_at).toLocaleString() });
type ContextValue = {
  account: Account | null; ready: boolean; demo: boolean; mockRecharge: boolean; balance: number; transactions: Transaction[]; refreshedAt: string; connectionError: string;
  signIn: (phone: string, password: string) => Promise<void>; signOut: (notifyServer?: boolean) => Promise<void>;
  reloadProfile: () => Promise<void>; refreshBalance: () => Promise<void>;
  submitRecharge: (body: RechargeRequest, key: string) => Promise<ApiTransaction>;
  topup: (amount: string, key: string) => Promise<ApiTransaction>;
  getTransaction: (id: string) => Promise<ApiTransaction>;
};
const RechargeContext = createContext<ContextValue | null>(null);
export function RechargeProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [demo, setDemo] = useState(false);
  const [mockRecharge, setMockRecharge] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshedAt, setRefreshedAt] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const epoch = useRef(0);
  const reset = useCallback(() => { epoch.current++; setAccount(null); setBalance(0); setTransactions([]); setConnectionError(""); }, []);
  useEffect(() => api.onSignedOut(reset), [reset]);
  const refreshBalance = useCallback(async () => {
    const current = epoch.current;
    const [wallet, history] = await Promise.all([
      api.request<{balance: string; updated_at: string}>("wallet"), api.request<ApiTransaction[]>("transactions?limit=100"),
    ]);
    if (current !== epoch.current) return;
    setBalance(Number(wallet.data.balance)); setTransactions(history.data.map(mapTransaction));
    setRefreshedAt(`Updated ${new Date(wallet.data.updated_at).toLocaleTimeString()}`); setConnectionError("");
  }, []);
  const reloadProfile = useCallback(async () => { const current = epoch.current; const result = await api.request<Account>("profile"); if (current === epoch.current) setAccount(result.data); }, []);
  const signOut = useCallback(async (notifyServer = true) => {
    try { if (notifyServer) await api.request("logout", {}); } finally { await api.clear(); }
  }, []);
  const signIn = useCallback(async (phone: string, password: string) => {
    reset();
    const result = await api.request<Session>("login", { phone, password }, { public: true });
    await api.accept(result.data);
    setAccount(result.data.account || null);
    try { const config = await api.request<AppConfig>("config", undefined, { public: true }); setDemo(config.data.demo); setMockRecharge(config.data.mock_recharge); await refreshBalance(); }
    catch (error) { setConnectionError(errorMessage(error)); }
  }, [reset, refreshBalance]);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const config = await api.request<AppConfig>("config", undefined, { public: true }); if (active) { setDemo(config.data.demo); setMockRecharge(config.data.mock_recharge); }
        if (await api.hasStoredSession()) { await api.refresh(); if (active) { await reloadProfile(); await refreshBalance(); } }
      } catch (error) { if (active) setConnectionError(errorMessage(error)); }
      finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
  }, [reloadProfile, refreshBalance]);
  const submitRecharge = useCallback(async (body: RechargeRequest, key: string) => {
    const result = await api.request<ApiTransaction>("recharges", body, { key });
    try { await refreshBalance(); } catch (error) { setConnectionError(errorMessage(error)); }
    return result.data;
  }, [refreshBalance]);
  const topup = useCallback(async (amount: string, key: string) => {
    const result = await api.request<ApiTransaction>("wallet/topups", { amount }, { key });
    try { await refreshBalance(); } catch (error) { setConnectionError(errorMessage(error)); }
    return result.data;
  }, [refreshBalance]);
  const getTransaction = useCallback(async (id: string) => {
    const receipt = (await api.request<ApiTransaction>(`transactions/${id}`)).data;
    if (receipt.provider === "mrobotics" && receipt.status === "Pending") {
      try { return (await api.request<ApiTransaction>(`recharges/${id}/status`, {})).data; }
      catch (error) { return {...receipt,provider_message:errorMessage(error)}; }
    }
    return receipt;
  }, []);
  const value = useMemo(() => ({ account, ready, demo, mockRecharge, balance, transactions, refreshedAt, connectionError, signIn, signOut, reloadProfile, refreshBalance, submitRecharge, topup, getTransaction }), [account, ready, demo, mockRecharge, balance, transactions, refreshedAt, connectionError, signIn, signOut, reloadProfile, refreshBalance, submitRecharge, topup, getTransaction]);
  return <RechargeContext.Provider value={value}>{children}</RechargeContext.Provider>;
}
export function useRecharge() { const value = useContext(RechargeContext); if (!value) throw new Error("RechargeProvider is missing"); return value; }
