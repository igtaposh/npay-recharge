import "./global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { KeyboardAvoidingView, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { RechargeProvider, useRecharge } from "../components/recharge-context";
import { AppStartupSkeleton } from "../components/ui";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RechargeProvider>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <AppRoutes />
          </KeyboardAvoidingView>
          <StatusBar style="dark" />
        </RechargeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppRoutes() {
  const { account, ready, demo, connectionError } = useRecharge();
  if (!ready) return <AppStartupSkeleton />;
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, freezeOnBlur: true }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!account}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(account)}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="privacy" />
          <Stack.Screen name="commissions" />
          <Stack.Screen name="developer" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="recharge" />
          <Stack.Screen name="transaction/[id]" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}
