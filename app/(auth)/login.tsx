import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, Field, Page } from "../../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    name: "",
    msg: "",
  });

  function submit() {
    if (!/^\d{10}$/.test(phone.trim())) {
      setError({
        name: "phone",
        msg: "Enter a valid 10-digit number.",
      });
      return;
    }
    if (password.length < 6) {
      setError({
        name: "password",
        msg: "Enter a valid password of at least 6 characters.",
      });
      return;
    }
    setError({
      name: "",
      msg: "",
    });
    router.replace("/(tabs)");
  }

  return (
    <Page>
      <View
        accessibilityLabel="NPay mobile recharge and wallet illustration"
        className="relative h-43.5 items-center justify-center overflow-hidden rounded-[30px] bg-[#EAF1FF]"
      >
        <View className="absolute -right-7 -top-12 h-36 w-36 rounded-full bg-[#D8E5FF]" />
        <View className="absolute -bottom-16 -left-7 h-36 w-36 rounded-full bg-[#D8E5FF]" />
        <View className="absolute left-[22%] top-5 h-2.5 w-2.5 rounded-full bg-[#8CB1FF]" />
        <View className="absolute right-[23%] bottom-7 h-2 w-2 rounded-full bg-[#8CB1FF]" />

        <View className="h-[132px] w-[90px] items-center rounded-[24px] border-[4px] border-white bg-[#0550DD] p-2.5 shadow-lg">
          <View className="mb-3 h-1 w-7 rounded-full bg-white/70" />
          <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-white">
            <MaterialIcons name="phone-android" size={25} color="#0550DD" />
          </View>
          <View className="mt-2.5 h-1.5 w-12 rounded-full bg-white/80" />
          <View className="mt-1.5 h-1.5 w-8 rounded-full bg-white/50" />
          <View className="absolute -right-5 bottom-3 h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#EAF1FF] bg-white">
            <MaterialIcons name="bolt" size={20} color="#E6A52E" />
          </View>
        </View>

        <View className="absolute left-[23%] top-9 h-10 w-10 items-center justify-center rounded-[14px] border-2 border-[#EAF1FF] bg-white shadow-sm">
          <MaterialIcons name="verified-user" size={21} color="#168A73" />
        </View>
        <View className="absolute right-[21%] top-9 h-9 w-9 items-center justify-center rounded-full bg-white/90">
          <MaterialIcons name="flash-on" size={19} color="#0550DD" />
        </View>
      </View>

      <View className="gap-2 relative">
        <Text className="text-sm text-center font-extrabold tracking-[1px] text-green">
          WELCOME BACK
        </Text>
        <Text className="text-center text-[30px] font-extrabold tracking-[-0.7px] text-ink">
          Good to see you again.
        </Text>
        <Text className="text-center text-[15px] leading-5.5 text-muted">
          Sign in to pick up right where you left off.
        </Text>
      </View>
      <View className="gap-4">
        <Field
          maxLength={10}
          value={phone}
          onChangeText={(value) => {
            setPhone(value.replace(/\D/g, "").slice(0, 10));
            if (error.name === "phone") setError({ name: "", msg: "" });
          }}
          placeholder="Mobile/User ID"
          keyboardType="phone-pad"
          error={error.name === "phone" ? error.msg : undefined}
        />
        <Field
          maxLength={16}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error.name === "password") setError({ name: "", msg: "" });
          }}
          keyboardType="visible-password"
          placeholder="Password"
          error={error.name === "password" ? error.msg : undefined}
          secureTextEntry
        />
      </View>

      <View className="flex-row gap-2 items-center justify-center">
        <Text className="text-md text-muted">Don&apos;t remember your password?</Text>
        <Link href={"/"} className="text-md font-mediumt text-green ">
          Reset it
        </Link>
      </View>

      <Button label="Sign in" onPress={submit} />
      <Text className="text-center text-[11px] leading-4.5 text-muted">
        By signing in, you agree to NPay&apos;s Terms &amp; Conditions and
        Privacy Policy.
      </Text>
      <View className="flex items-center justify-center">
        <Text className="text-sm text-muted">Don&apos;t have any account?</Text>
        <Link href={"/"} className="text-sm font-mediumt text-green ">
          Register as an nPay recharge partner
        </Link>
      </View>
    </Page>
  );
}
