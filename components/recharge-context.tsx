import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

export type TransactionStatus = "Successful" | "Pending" | "Failed";

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  category: "recharge" | "wallet" | "google-play";
};

type RechargeContextValue = {
  balance: number;
  transactions: Transaction[];
  refreshedAt: string;
  mpin: string;
  refreshBalance: () => void;
  addBalance: (amount: number) => void;
  updateMpin: (mpin: string) => void;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "date" | "status"> & {
      status?: TransactionStatus;
    },
  ) => string;
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
    category: "recharge",
  },
  {
    id: "sample-2",
    title: "Google Play",
    subtitle: "Gift code · •••• 1190",
    amount: 500,
    date: "Yesterday",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-3",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-4",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-5",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-6",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-7",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "recharge",
  },
  {
    id: "sample-8",
    title: "Airtel DTH",
    subtitle: "DTH recharge · •••• 7305",
    amount: 350,
    date: "12 Jun, 2026",
    status: "Successful",
    category: "google-play",
  },
];

export function RechargeProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1840.5);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [refreshedAt, setRefreshedAt] = useState("Updated just now");
  const [mpin, setMpin] = useState("1234");

  const value = useMemo<RechargeContextValue>(
    () => ({
      balance,
      transactions,
      refreshedAt,
      mpin,
      refreshBalance: () =>
        setRefreshedAt(
          `Updated at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
        ),
      addBalance: (amount) => {
        setBalance((current) => current + amount);
        setRefreshedAt("Updated just now");
      },
      updateMpin: (nextMpin) => setMpin(nextMpin),
      addTransaction: (transaction) => {
        const status = transaction.status ?? "Successful";
        const id = `${Date.now()}-${Math.random()}`;

        if (status === "Successful") {
          setBalance((current) =>
            transaction.category === "wallet"
              ? current + transaction.amount
              : current - transaction.amount,
          );
          setRefreshedAt("Updated just now");
        }

        setTransactions((current) => [
          {
            ...transaction,
            id,
            date: "Just now",
            status,
          },
          ...current,
        ]);

        return id;
      },
    }),
    [balance, transactions, refreshedAt, mpin],
  );

  return (
    <RechargeContext.Provider value={value}>
      {children}
    </RechargeContext.Provider>
  );
}

export function useRecharge() {
  const context = useContext(RechargeContext);
  if (!context) {
    throw new Error("useRecharge must be used within a RechargeProvider");
  }
  return context;
}
