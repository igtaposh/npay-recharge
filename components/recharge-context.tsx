import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status: "Successful" | "Pending";
};

type RechargeContextValue = {
  balance: number;
  transactions: Transaction[];
  refreshedAt: string;
  refreshBalance: () => void;
  addBalance: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "status">) => void;
};

const RechargeContext = createContext<RechargeContextValue | null>(null);

const initialTransactions: Transaction[] = [
  {
    id: "sample-1",
    title: "Jio prepaid",
    subtitle: "Mobile recharge · •••• 4821",
    amount: 299,
    date: "Today, 10:42 AM",
    status: "Successful",
  },
  {
    id: "sample-2",
    title: "Google Play",
    subtitle: "Gift code · •••• 1190",
    amount: 500,
    date: "Yesterday",
    status: "Successful",
  },
  {
    id: "sample-3",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
  },
];

export function RechargeProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1840.5);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [refreshedAt, setRefreshedAt] = useState("Updated just now");

  const value = useMemo<RechargeContextValue>(
    () => ({
      balance,
      transactions,
      refreshedAt,
      refreshBalance: () =>
        setRefreshedAt(
          `Updated at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
        ),
      addBalance: (amount) => {
        setBalance((current) => current + amount);
        setRefreshedAt("Updated just now");
      },
      addTransaction: (transaction) => {
        setBalance((current) => current - transaction.amount);
        setTransactions((current) => [
          {
            ...transaction,
            id: `${Date.now()}-${Math.random()}`,
            date: "Just now",
            status: "Successful",
          },
          ...current,
        ]);
      },
    }),
    [balance, transactions, refreshedAt],
  );

  return <RechargeContext.Provider value={value}>{children}</RechargeContext.Provider>;
}

export function useRecharge() {
  const context = useContext(RechargeContext);
  if (!context) {
    throw new Error("useRecharge must be used within a RechargeProvider");
  }
  return context;
}
