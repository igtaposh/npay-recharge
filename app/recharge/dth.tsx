import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, Card, Field, Page, PageHeading } from "../../components/ui";
import { useRecharge } from "../../components/recharge-context";

const amounts = [200, 300, 500, 1000];

export default function DthScreen() {
  const router = useRouter();
  const { balance, addTransaction } = useRecharge();
  const [subscriber, setSubscriber] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  function submit() {
    if (subscriber.trim().length < 6) {
      setError("Enter your DTH subscriber ID (at least 6 characters).");
      return;
    }
    if (amount === null) {
      setError("Choose a recharge amount to continue.");
      return;
    }
    if (amount > balance) {
      setError("Your wallet balance is too low. Add balance to continue.");
      return;
    }
    setError("");
    addTransaction({ title: "DTH recharge", subtitle: `DTH top-up · •••• ${subscriber.trim().slice(-4)}`, amount });
    router.replace("/(tabs)/history");
  }

  return (
    <Page>
      <PageHeading eyebrow="TELEVISION" title="DTH recharge" subtitle="Keep your favourite shows coming." />
      <Card className="flex-row items-center gap-3.5">
        <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-[#FFF1DC]"><Text className="text-[22px] text-[#BB7921]">▤</Text></View>
        <View className="flex-1 gap-1">
          <Text className="text-[15px] font-extrabold text-ink">Instant top-ups</Text>
          <Text className="text-xs text-muted">Tata Play · Airtel · Dish TV · Sun Direct</Text>
        </View>
      </Card>
      <Field
        label="Subscriber ID"
        value={subscriber}
        onChangeText={(value) => { setSubscriber(value); setError(""); }}
        placeholder="Enter your DTH customer ID"
      />
      <View className="gap-3">
        <Text className="text-base font-extrabold text-ink">Select an amount</Text>
        <View className="flex-row flex-wrap gap-3">
          {amounts.map((value) => (
            <Button
              key={value}
              label={`₹${value}`}
              variant={amount === value ? "secondary" : "ghost"}
              onPress={() => { setAmount(value); setError(""); }}
            />
          ))}
        </View>
      </View>
      {error ? <Text className="text-[13px] leading-5 text-danger">{error}</Text> : null}
      <Button label={amount ? `Continue · ₹${amount}` : "Choose an amount"} onPress={submit} />
      <Text className="text-center text-xs leading-5 text-muted">Demo only. No real DTH recharge will be made.</Text>
    </Page>
  );
}
