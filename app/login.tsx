import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Field, Page } from "../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!/^\d{10}$/.test(phone.trim()) || password.length < 6) {
      setError("Enter a valid 10-digit number and a password of at least 6 characters.");
      return;
    }
    setError("");
    router.replace("/(tabs)");
  }

  return (
    <Page>
      <View className="mb-[26px] flex-row items-center gap-2">
        <Text className="h-9 w-9 overflow-hidden rounded-[13px] bg-green text-center text-[23px] font-extrabold text-white">n</Text>
        <Text className="text-xl font-extrabold tracking-[-0.5px] text-ink">npay</Text>
      </View>
      <View className="mb-1 gap-[7px]">
        <Text className="text-[11px] font-extrabold tracking-[1px] text-green">WELCOME BACK</Text>
        <Text className="text-[27px] font-extrabold tracking-[-0.6px] text-ink">Good to see you again.</Text>
        <Text className="text-[13px] leading-5 text-muted">Sign in to pick up right where you left off.</Text>
      </View>
      <View className="gap-4">
        <Field
          label="Mobile number"
          value={phone}
          onChangeText={(value) => { setPhone(value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={(value) => { setPassword(value); setError(""); }}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      <Button label="Sign in" onPress={submit} />
      <Text className="text-center text-[10px] leading-4 text-muted">Demo screen only · No account data is sent anywhere.</Text>
      <View className="mt-1 flex-row justify-center">
        <Text className="text-[13px] text-muted">New to NPay?</Text>
        <Link href="/signup" asChild>
          <Pressable accessibilityRole="link"><Text className="text-[13px] font-extrabold text-green"> Create an account</Text></Pressable>
        </Link>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.replace("/(tabs)")} className="items-center py-[13px]">
        <Text className="text-[13px] font-bold text-ink">Continue as guest</Text>
      </Pressable>
    </Page>
  );
}
