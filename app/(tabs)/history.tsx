import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";
import { Card, Page, PageHeading } from "../../components/ui";

export default function HistoryScreen() {
  const { transactions } = useRecharge();

  return (
    <Page>
      <PageHeading
        eyebrow="YOUR ACTIVITY"
        title="Recharge history"
        subtitle="Every payment, all in one place."
      />
      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            TOTAL RECHARGES
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            {transactions.length}
          </Text>
          <Text className="text-xs text-muted">on this device</Text>
        </Card>
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            THIS MONTH
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            ₹
            {transactions
              .reduce((sum, item) => sum + item.amount, 0)
              .toLocaleString("en-IN")}
          </Text>
          <Text className="text-xs text-muted">demo activity</Text>
        </Card>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-extrabold text-ink">Recent activity</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/history")}
          hitSlop={8}
        >
          <Text className="text-sm font-bold text-green">See all</Text>
        </Pressable>
      </View>
      <View className="rounded-xl border border-gray-300 bg-white px-4">
        {transactions.length ? (
          transactions
            .map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
        ) : (
          <Text className="py-6 text-sm text-muted">
            Your recharge activity will show up here.
          </Text>
        )}
      </View>
      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
