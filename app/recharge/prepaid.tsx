import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Card, Field, Page, PageHeading } from "../../components/ui";
import { useRecharge } from "../../components/recharge-context";

const plans = [
  { amount: 199, detail: "1.5 GB/day · 28 days" },
  { amount: 299, detail: "2 GB/day · 28 days" },
  { amount: 719, detail: "1.5 GB/day · 84 days" },
];

export default function PrepaidScreen() {
  const router = useRouter();
  const { balance, addTransaction } = useRecharge();
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");

  function submit() {
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (selected === null) {
      setError("Choose a recharge plan to continue.");
      return;
    }
    if (selected > balance) {
      setError("Your wallet balance is too low. Add balance to continue.");
      return;
    }
    setError("");
    addTransaction({ title: "Prepaid recharge", subtitle: `Mobile recharge · •••• ${phone.slice(-4)}`, amount: selected });
    router.replace("/(tabs)/history");
  }

  return (
    <Page>
      <PageHeading eyebrow="MOBILE RECHARGE" title="Prepaid" subtitle="Top up your number in just a few taps." />
      <Card className="flex-row items-center gap-3.5 p-4">
        <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-green-light"><Text className="text-[22px] text-green">▣</Text></View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-extrabold text-ink">All major operators</Text>
          <Text className="text-xs text-muted">Jio · Airtel · Vi · BSNL</Text>
        </View>
        <Text className="text-[11px] font-extrabold tracking-[0.5px] text-green">SECURE</Text>
      </Card>
      <Field
        label="Mobile number"
        value={phone}
        onChangeText={(value) => { setPhone(value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
      />
      <View className="gap-3">
        <Text className="mb-0.5 text-base font-extrabold text-ink">Choose a plan</Text>
        {plans.map((plan) => (
          <Pressable
            key={plan.amount}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === plan.amount }}
            onPress={() => { setSelected(plan.amount); setError(""); }}
            className={`flex-row items-center justify-between rounded-[20px] border p-4 ${selected === plan.amount ? "border-green bg-green-light" : "border-line bg-white"}`}
          >
            <View className="gap-1">
              <Text className="text-lg font-extrabold text-ink">₹{plan.amount}</Text>
              <Text className="text-[13px] text-muted">{plan.detail}</Text>
            </View>
            <View className={`h-[21px] w-[21px] items-center justify-center rounded-full border-[1.5px] ${selected === plan.amount ? "border-green" : "border-[#CBD6D3]"}`}>
              {selected === plan.amount ? <View className="h-[11px] w-[11px] rounded-full bg-green" /> : null}
            </View>
          </Pressable>
        ))}
      </View>
      {error ? <Text className="text-[13px] leading-5 text-danger">{error}</Text> : null}
      <Button label={selected ? `Recharge ₹${selected}` : "Choose a plan"} onPress={submit} />
      <Text className="text-center text-xs leading-5 text-muted">Demo only. No real mobile recharge will be made.</Text>
    </Page>
  );
}
