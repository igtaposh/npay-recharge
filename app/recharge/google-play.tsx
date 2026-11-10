import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { Button, Card, Field, Page, PageHeading } from "../../components/ui";

const amounts = [100, 250, 500, 1000];

export default function GooglePlayScreen() {
  const router = useRouter();
  const { balance, addTransaction } = useRecharge();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid Google account email.");
      return;
    }
    if (amount === null) {
      setError("Choose a gift code value to continue.");
      return;
    }
    if (amount > balance) {
      setError("Your wallet balance is too low. Add balance to continue.");
      return;
    }
    setError("");
    addTransaction({
      title: "Google Play code",
      subtitle: `Gift code · ${email.trim()}`,
      amount,
    });
    router.replace("/(tabs)/history");
  }

  return (
    <Page>
      <PageHeading
        eyebrow="GIFT & ENTERTAINMENT"
        title="Google Play"
        subtitle="A little something for your next favourite thing."
      />
      <Card className="items-center gap-3 py-7">
        <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-[#EEEAFE]">
          <Text className="ml-[3px] text-[25px] text-[#6758C8]">▶</Text>
        </View>
        <Text className="text-[21px] font-extrabold text-ink">
          Play more, your way.
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted">
          Choose a value and enter the Google account email for your gift code.
        </Text>
      </Card>

      <Field
        maxLength={255}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError("");
        }}
        keyboardType="visible-password"
        placeholder="Password"
        secureTextEntry
      />
      <View className="gap-3">
        <Text className="text-base font-extrabold text-ink">
          Choose a value
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {amounts.map((value) => (
            <Button
              key={value}
              label={`₹${value}`}
              variant={amount === value ? "secondary" : "ghost"}
              onPress={() => {
                setAmount(value);
                setError("");
              }}
            />
          ))}
        </View>
      </View>
      {error ? (
        <Text className="text-[13px] leading-5 text-danger">{error}</Text>
      ) : null}
      <Button
        label={amount ? `Get code · ₹${amount}` : "Choose a value"}
        onPress={submit}
      />
      <Text className="text-center text-xs leading-5 text-muted">
        Demo only. No real gift code will be issued.
      </Text>
    </Page>
  );
}
