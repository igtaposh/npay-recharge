import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useRecharge } from "./recharge-context";

export function WalletBalanceBar() {
  const router = useRouter();
  const { balance } = useRecharge();

  return (
    <View className="flex flex-row">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Wallet balance ₹${balance.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}. Open wallet.`}
        onPress={() => router.push("/(tabs)/wallet")}
        className="flex-row items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4"
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-green-light">
          <MaterialIcons
            name="account-balance-wallet"
            size={18}
            color="#0550DD"
          />
        </View>
        <Text className="text-md  font-extrabold tracking-[-0.2px] text-ink">
          ₹
          {balance.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Text>
      </Pressable>
    </View>
  );
}
