import { Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";
import { Card, Page, PageHeading } from "../../components/ui";

export default function HistoryScreen() {
  const { transactions } = useRecharge();

  return (
    <Page activeTab="History">
      <PageHeading eyebrow="YOUR ACTIVITY" title="Recharge history" subtitle="Every payment, all in one place." />
      <View className="flex-row gap-[11px]">
        <Card className="flex-1 gap-[5px] p-[15px]">
          <Text className="text-[9px] font-extrabold tracking-[0.7px] text-muted">TOTAL RECHARGES</Text>
          <Text className="text-[21px] font-extrabold text-ink">{transactions.length}</Text>
          <Text className="text-[11px] text-muted">on this device</Text>
        </Card>
        <Card className="flex-1 gap-[5px] p-[15px]">
          <Text className="text-[9px] font-extrabold tracking-[0.7px] text-muted">THIS MONTH</Text>
          <Text className="text-[21px] font-extrabold text-ink">₹{transactions.reduce((sum, item) => sum + item.amount, 0).toLocaleString("en-IN")}</Text>
          <Text className="text-[11px] text-muted">demo activity</Text>
        </Card>
      </View>
      <View className="rounded-[20px] bg-white px-[15px] pb-[5px] pt-[18px]">
        <Text className="mb-[3px] text-base font-extrabold text-ink">Recent transactions</Text>
        {transactions.length ? (
          transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text className="py-6 text-[13px] text-muted">Your recharge activity will show up here.</Text>
        )}
      </View>
      <Text className="text-[11px] leading-[17px] text-muted">These sample transactions are stored only in this app session.</Text>
    </Page>
  );
}
