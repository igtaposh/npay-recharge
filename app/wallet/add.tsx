import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Card, Field, Page, PageHeading } from "../../components/ui";
import { useRecharge } from "../../components/recharge-context";

const suggestions = [500, 1000, 2000, 5000];

export default function AddBalanceScreen() {
  const router = useRouter();
  const { balance, addBalance } = useRecharge();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 1 || parsedAmount > 100000) {
      setError("Enter an amount between ₹1 and ₹1,00,000.");
      return;
    }
    addBalance(parsedAmount);
    router.replace("/(tabs)");
  }

  return (
    <Page>
      <PageHeading eyebrow="YOUR WALLET" title="Add balance" subtitle="Top up your demo wallet in a few taps." />
      <Card className="gap-[7px] border-[#D3EAE3] bg-green-light">
        <Text className="text-[10px] font-extrabold tracking-[0.8px] text-green">AVAILABLE BALANCE</Text>
        <Text className="text-[27px] font-extrabold text-ink">₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
      </Card>
      <Field
        label="Amount to add"
        value={amount}
        onChangeText={(value) => { setAmount(value.replace(/[^\d.]/g, "")); setError(""); }}
        placeholder="Enter amount in ₹"
        keyboardType="numeric"
      />
      <View className="-mt-[7px] flex-row flex-wrap gap-[9px]">
        {suggestions.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            onPress={() => { setAmount(String(value)); setError(""); }}
            className={`rounded-[13px] border px-[13px] py-2.5 ${amount === String(value) ? "border-green bg-green-light" : "border-line bg-white"}`}
          >
            <Text className={`text-xs font-bold ${amount === String(value) ? "text-green" : "text-ink"}`}>+ ₹{value.toLocaleString("en-IN")}</Text>
          </Pressable>
        ))}
      </View>
      <Card className="gap-3.5">
        <Text className="text-[10px] font-extrabold tracking-[0.7px] text-muted">PAYMENT METHOD</Text>
        <View className="flex-row items-center gap-[11px]">
          <View className="h-[39px] w-[39px] items-center justify-center rounded-[13px] bg-green-light"><Text className="text-[17px] text-green">▤</Text></View>
          <View className="flex-1 gap-[3px]">
            <Text className="text-[13px] font-bold text-ink">UPI payment</Text>
            <Text className="text-[11px] text-muted">Secure demo checkout</Text>
          </View>
          <Text className="text-[9px] font-extrabold text-green">SELECTED</Text>
        </View>
      </Card>
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      <Button label={amount ? `Add ₹${Number(amount).toLocaleString("en-IN")}` : "Enter an amount"} onPress={submit} />
      <Text className="text-center text-[11px] text-muted">Demo only. No money will be charged or transferred.</Text>
    </Page>
  );
}
