import "./global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { RechargeProvider } from "../components/recharge-context";
import { AppStartupSkeleton } from "../components/ui";

export default function RootLayout() {
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarting(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RechargeProvider>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {isStarting ? (
              <AppStartupSkeleton />
            ) : (
              <Stack
                screenOptions={{
                  headerShown: false,
                  freezeOnBlur: true,
                }}
              />
            )}
          </KeyboardAvoidingView>
          <StatusBar style="dark" />
        </RechargeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
