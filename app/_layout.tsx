import "./global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RechargeProvider } from "../components/recharge-context";
import { AppStartupSkeleton } from "../components/ui";

export default function RootLayout() {
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarting(false), 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <RechargeProvider>
        {isStarting ? (
          <AppStartupSkeleton />
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 240,
            }}
          />
        )}
        <StatusBar style="dark" />
      </RechargeProvider>
    </SafeAreaProvider>
  );
}
