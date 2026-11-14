import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { Button, Card, Page, PageHeading } from "../../components/ui";
import {
  MAX_GIFT_AMOUNT,
  MIN_GIFT_AMOUNT,
  googlePlaySuggestions,
} from "../../data/google-play";


export default function GooglePlayScreen() {
  const router = useRouter();
  const { balance } = useRecharge();
  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [error, setError] = useState({ name: "", msg: "" });

  const parsedAmount = Number(amount);
  const isAmountChosen = amount !== "";

  function clearError() {
    setError({ name: "", msg: "" });
  }

  function submit() {
    if (!isAmountChosen) {
      setError({
        name: "amount",
        msg: "Enter a gift card amount.",
      });
      return;
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount < MIN_GIFT_AMOUNT) {
      setError({
        name: "amount",
        msg: `Gift codes start at ₹${MIN_GIFT_AMOUNT.toLocaleString("en-IN")}.`,
      });
      return;
    }

    if (parsedAmount > MAX_GIFT_AMOUNT) {
      setError({
        name: "amount",
        msg: `Gift codes go up to ₹${MAX_GIFT_AMOUNT.toLocaleString("en-IN")}.`,
      });
      return;
    }

    if (parsedAmount > balance) {
      setError({
        name: "amount",
        msg: "Your wallet balance is too low. Add balance to continue.",
      });
      return;
    }

    clearError();
    router.push({
      pathname: "/recharge/confirm",
      params: {
        service: "google-play",
        amount: String(parsedAmount),
      },
    });
  }

  return (
    <Page>
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-[15px] border border-line bg-white"
        >
          <MaterialIcons name="arrow-back" size={22} color="#172B4D" />
        </Pressable>
        <WalletBalanceBar />
      </View>

      <PageHeading
        eyebrow="GIFT & ENTERTAINMENT"
        title="Google Play"
        subtitle="A little something for your next favourite thing."
      />

      <Card className="flex-row items-center gap-3.5 p-4">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFF]">
          <Image
            accessibilityLabel="Google Play logo"
            source={require("../../assets/company-logos/google-play.png")}
            style={{ width: 36, height: 36, resizeMode: "contain" }}
          />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#7157C8]">
            Gift code
          </Text>
          <Text className="text-base font-extrabold text-ink">
            Delivered instantly
          </Text>
          <Text className="text-xs font-medium text-muted">
            Apps, games, movies and more.
          </Text>
        </View>
        <View className="rounded-full bg-[#F0EDFF] px-3 py-1.5">
          <Text className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-[#7157C8]">
            Digital
          </Text>
        </View>
      </Card>

      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-ink">Gift card amount</Text>
          <Text className="text-xs font-medium text-muted">
            {`₹${MIN_GIFT_AMOUNT.toLocaleString("en-IN")} – ₹${MAX_GIFT_AMOUNT.toLocaleString("en-IN")}`}
          </Text>
        </View>
        <View
          className={`min-h-17 flex-row items-center gap-3 rounded-xl border bg-white px-2 ${
            error.name === "amount"
              ? "border-danger"
              : amountFocused
                ? "border-green"
                : "border-gray-300"
          }`}
        >
          <View className="p-2">
            <Text className="ml-1 text-xl font-bold text-ink">₹</Text>
          </View>
          <View className="h-12 w-px bg-gray-300" />
          <TextInput
            accessibilityLabel="Gift card amount"
            className="min-h-17 flex-1 p-0 pl-2 text-xl tracking-[1px] text-ink"
            value={amount}
            onChangeText={(value) => {
              setAmount(value.replace(/\D/g, "").slice(0, 5));
              clearError();
            }}
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            placeholder="Enter amount"
            placeholderTextColor="#8A98AB"
            keyboardType="number-pad"
            maxLength={5}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          {amount ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear amount"
              onPress={() => {
                setAmount("");
                clearError();
              }}
              className="h-10 w-10 items-center justify-center"
            >
              <MaterialIcons name="cancel" size={20} color="#8A98AB" />
            </Pressable>
          ) : null}
        </View>
        {error.name === "amount" ? (
          <Text className="text-[13px] leading-5 text-danger">{error.msg}</Text>
        ) : null}
      </View>

      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-ink">Suggested amounts</Text>
          <Text className="text-xs font-medium text-muted">Tap to fill</Text>
        </View>
        <View className="gap-2.5">
          {[0, 3].map((start) => (
            <View key={start} className="flex-row gap-2.5">
              {googlePlaySuggestions
                .slice(start, start + 3)
                .map((suggestion) => {
                  const isSelected = parsedAmount === suggestion.amount;

                  return (
                    <Pressable
                      key={suggestion.amount}
                      accessibilityRole="button"
                      accessibilityLabel={`₹${suggestion.amount} ${suggestion.tag}`}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        setAmount(String(suggestion.amount));
                        clearError();
                      }}
                      className={`flex-1 gap-1.5 rounded-xl border px-3 py-3.5 ${
                        isSelected
                          ? "border-green bg-green-light"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-base font-extrabold ${
                          isSelected ? "text-green" : "text-ink"
                        }`}
                      >
                        ₹{suggestion.amount.toLocaleString("en-IN")}
                      </Text>
                      <Text
                        className={`text-[10px] font-bold uppercase tracking-[0.6px] ${
                          isSelected ? "text-green" : "text-muted"
                        }`}
                      >
                        {suggestion.tag}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          ))}
        </View>
      </View>

      <Button
        disabled={!isAmountChosen}
        label={
          isAmountChosen
            ? `Pay ₹${Number(amount).toLocaleString("en-IN")}`
            : "Enter an amount"
        }
        onPress={submit}
      />
      <Text className="text-center text-[11px] leading-4.5 text-muted">
        Demo only. No real gift code will be issued.
      </Text>
    </Page>
  );
}
