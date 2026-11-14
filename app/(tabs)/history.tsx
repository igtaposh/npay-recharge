import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";
import { Card, Page, PageHeading } from "../../components/ui";

type HistoryFilter = "all" | "recharge" | "wallet";

export default function HistoryScreen() {
  const { transactions } = useRecharge();
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.category === filter);
  const rechargeSpend = transactions
    .filter((transaction) => transaction.category === "recharge")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <Page>
      <PageHeading
        eyebrow="YOUR ACTIVITY"
        title="Transaction history"
        subtitle="Tap any transaction to see its details."
      />
      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            TRANSACTIONS
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            {transactions.length}
          </Text>
          <Text className="text-xs text-muted">all activity</Text>
        </Card>
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            RECHARGE SPEND
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            ₹{rechargeSpend.toLocaleString("en-IN")}
          </Text>
          <Text className="text-xs text-muted">wallet top-ups excluded</Text>
        </Card>
      </View>
      <Text className="text-xl font-extrabold text-ink">Activity</Text>
      <View className="flex-row gap-2">
        {(
          [
            ["all", "All"],
            ["recharge", "Recharges"],
            ["wallet", "Wallet"],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === value }}
            onPress={() => setFilter(value)}
            className={`rounded-full border px-4 py-2.5 ${filter === value ? "border-green bg-green" : "border-line bg-white"}`}
          >
            <Text
              className={`text-[13px] font-bold ${filter === value ? "text-white" : "text-ink"}`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="rounded-xl border border-gray-300 bg-white px-4">
        {filteredTransactions.length ? (
          filteredTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text className="py-6 text-center text-sm text-muted">
            {filter === "wallet"
              ? "Wallet top-ups will show up here."
              : filter === "recharge"
                ? "Your recharge activity will show up here."
                : "Your transactions will show up here."}
          </Text>
        )}
      </View>
      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
