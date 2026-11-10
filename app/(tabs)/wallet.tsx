import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";
import { Card, Page, PageHeading } from "../../components/ui";

export default function WalletScreen() {
  const router = useRouter();
  const { balance, transactions, refreshedAt } = useRecharge();

  return (
    <Page>
      <PageHeading
        eyebrow="YOUR MONEY"
        title="Wallet"
        subtitle="Your balance and recent activity."
      />

      <View className="relative gap-2 justify-between overflow-hidden rounded-xl bg-[#0550DD] p-6">
        <View className="flex-row items-start justify-between">
          <View className="gap-1">
            <Text className="text-xs font-bold tracking-[1px] text-white/75">
              AVAILABLE BALANCE
            </Text>
            <Text className="mt-1 text-[34px] font-extrabold tracking-[-0.7px] text-white">
              ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
            <Text className="text-xs text-white/75">{refreshedAt}</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-white/15">
            <Text className="text-[22px] font-bold text-white">₹</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/wallet/add")}
          className="self-start rounded-[14px] bg-white px-4 py-3"
        >
          <Text className="text-sm font-extrabold text-[#0550DD]">
            ＋ Add money
          </Text>
        </Pressable>
        <View className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full border-[26px] border-white/10" />
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            TRANSACTIONS
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            {transactions.length}
          </Text>
          <Text className="text-xs text-muted">in this session</Text>
        </Card>
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            TOTAL SPENT
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
          transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text className="py-6 text-sm text-muted">
            Your wallet activity will show up here.
          </Text>
        )}
      </View>
      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
