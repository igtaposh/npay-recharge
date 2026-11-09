import { Text, View } from "react-native";
import type { Transaction } from "./recharge-context";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <View className="flex-row items-center gap-3 border-b border-line py-[15px]">
      <View className="h-[42px] w-[42px] items-center justify-center rounded-[15px] bg-green-light">
        <Text className="text-[19px] font-extrabold text-green">{transaction.title.toLowerCase().includes("google") ? "G" : "↗"}</Text>
      </View>
      <View className="flex-1 gap-[3px]">
        <Text className="text-sm font-bold text-ink">{transaction.title}</Text>
        <Text className="text-[11px] text-muted">{transaction.subtitle}</Text>
        <Text className="text-[10px] text-muted">{transaction.date}</Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-[13px] font-bold text-ink">− ₹{transaction.amount.toLocaleString("en-IN")}</Text>
        <Text className="text-[10px] font-bold text-green">{transaction.status}</Text>
      </View>
    </View>
  );
}
