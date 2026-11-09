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
      <Card className="flex-row items-center gap-3 p-[15px]">
        <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-green-light"><Text className="text-xl text-green">▣</Text></View>
        <View className="flex-1 gap-1">
          <Text className="text-[13px] font-extrabold text-ink">All major operators</Text>
          <Text className="text-[11px] text-muted">Jio · Airtel · Vi · BSNL</Text>
        </View>
        <Text className="text-[9px] font-extrabold tracking-[0.5px] text-green">SECURE</Text>
      </Card>
      <Field
        label="Mobile number"
        value={phone}
        onChangeText={(value) => { setPhone(value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
      />
      <View className="gap-2.5">
        <Text className="mb-0.5 text-[15px] font-extrabold text-ink">Choose a plan</Text>
        {plans.map((plan) => (
          <Pressable
            key={plan.amount}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === plan.amount }}
            onPress={() => { setSelected(plan.amount); setError(""); }}
            className={`flex-row items-center justify-between rounded-2xl border p-[15px] ${selected === plan.amount ? "border-green bg-[#F0F8F5]" : "border-line bg-white"}`}
          >
            <View className="gap-1">
              <Text className="text-[17px] font-extrabold text-ink">₹{plan.amount}</Text>
              <Text className="text-xs text-muted">{plan.detail}</Text>
            </View>
            <View className={`h-[21px] w-[21px] items-center justify-center rounded-full border-[1.5px] ${selected === plan.amount ? "border-green" : "border-[#CBD6D3]"}`}>
              {selected === plan.amount ? <View className="h-[11px] w-[11px] rounded-full bg-green" /> : null}
            </View>
          </Pressable>
        ))}
      </View>
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      <Button label={selected ? `Recharge ₹${selected}` : "Choose a plan"} onPress={submit} />
      <Text className="text-center text-[11px] text-muted">Demo only. No real mobile recharge will be made.</Text>
    </Page>
  );
}
