import "./global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RechargeProvider } from "../components/recharge-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RechargeProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </RechargeProvider>
    </SafeAreaProvider>
  );
}
