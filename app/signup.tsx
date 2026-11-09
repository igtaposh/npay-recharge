import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Field, Page } from "../components/ui";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (name.trim().length < 2) {
      setError("Enter your name to continue.");
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    setError("");
    router.replace("/(tabs)");
  }

  return (
    <Page>
      <View className="mb-[18px] flex-row items-center gap-2">
        <Text className="h-9 w-9 overflow-hidden rounded-[13px] bg-green text-center text-[23px] font-extrabold text-white">n</Text>
        <Text className="text-xl font-extrabold tracking-[-0.5px] text-ink">npay</Text>
      </View>
      <View className="mb-0.5 gap-[7px]">
        <Text className="text-[11px] font-extrabold tracking-[0.8px] text-green">A LITTLE MORE CONVENIENCE</Text>
        <Text className="text-[27px] font-extrabold tracking-[-0.6px] text-ink">Create your account.</Text>
        <Text className="text-[13px] leading-5 text-muted">Join NPay and make everyday recharges feel effortless.</Text>
      </View>
      <View className="gap-[13px]">
        <Field label="Full name" value={name} onChangeText={(value) => { setName(value); setError(""); }} placeholder="How should we call you?" />
        <Field
          label="Mobile number"
          value={phone}
          onChangeText={(value) => { setPhone(value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
        />
        <Field label="Email address" value={email} onChangeText={(value) => { setEmail(value); setError(""); }} placeholder="you@example.com" keyboardType="email-address" />
        <Field label="Create password" value={password} onChangeText={(value) => { setPassword(value); setError(""); }} placeholder="At least 6 characters" secureTextEntry />
      </View>
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      <Button label="Create account" onPress={submit} />
      <Text className="text-center text-[10px] leading-4 text-muted">Demo screen only · Details are not saved or sent.</Text>
      <View className="mt-[3px] flex-row justify-center">
        <Text className="text-[13px] text-muted">Already have an account?</Text>
        <Link href="/login" asChild>
          <Pressable accessibilityRole="link"><Text className="text-[13px] font-extrabold text-green"> Sign in</Text></Pressable>
        </Link>
      </View>
    </Page>
  );
}
