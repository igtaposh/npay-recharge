import Ionicons from "@react-native-vector-icons/ionicons/static";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";
import { Page, SectionTitle } from "../../components/ui";

const services = [
  {
    title: "Prepaid",
    subtitle: "Mobile recharge",
    icon: "phone",
    accent: "bolt",
    href: "/recharge/prepaid",
    tint: "#1761DF",
    surface: "#EAF1FF",
  },
  {
    title: "DTH",
    subtitle: "DTH plans",
    icon: "live-tv",
    accent: "satellite-alt",
    href: "/recharge/dth",
    tint: "#C47716",
    surface: "#FFF2DE",
  },
  {
    title: "Google Play",
    subtitle: "Gift codes",
    icon: "redeem",
    accent: "auto-awesome",
    href: "/recharge/google-play",
    tint: "#7157C8",
    surface: "#F0EDFF",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { balance, transactions, refreshedAt, refreshBalance } = useRecharge();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Page>
      <View className="flex-row items-center gap-3.5 py-1">
        <View className="flex-1 gap-0.5">
          <Text className="text-xs font-bold tracking-[0.8px] text-muted">
            YOUR EVERYDAY PAYMENTS
          </Text>
          <Text className="text-[22px] font-extrabold text-ink">
            Hello, Alex <Ionicons name="color-wand-outline" size={20} />
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push("/settings")}
          className="items-center justify-center p-2 flex flex-row gap-2 rounded-md bg -white border border-line "
        >
          <Ionicons name="reorder-three-outline" size={25} />
          <Text className="text-lg">Menu</Text>
        </Pressable>
      </View>

      <View className="flex flex-row justify-between items-center relative h-36 overflow-hidden rounded-xl bg-green px-6 py-2">
        <View className="flex items-center justify-between gap-4">
          <View className="flex-row items-center  w-full  gap-2.5">
            <Text className="text-xs font-bold tracking-[1px] mr-2 text-[#DCE8FF]">
              WALLET BALANCE
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showBalance ? "Hide balance" : "Show balance"}
              onPress={() => setShowBalance((visible) => !visible)}
            >
              {showBalance ? (
                <Ionicons name="eye-off-outline" color="white" size={18} />
              ) : (
                <Ionicons name="eye-outline" color="white" size={18} />
              )}
            </Pressable>
          </View>
          <View className="flex text-left w-full gap-1 flex-row">
            <Text className="text-4xl font-extrabold tracking-[-0.8px] text-white">
              ₹
            </Text>
            <Text className="text-4xl  font-extrabold tracking-[-0.8px] text-white">
              {showBalance
                ? `${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                : "••••••"}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh wallet balance"
          onPress={refreshBalance}
          className="h-10 w-10 items-center justify-center rounded-[14px] bg-white/15"
        >
          <Ionicons name="refresh" color="white" size={20} />
        </Pressable>
        <View className="absolute -bottom-24 -right-14 h-[170px] w-[170px] rounded-full border-30 border-white/5" />
      </View>

      <View className="flex-row mt-4 items-center justify-between">
        <View>
          <Text className="text-xl font-extrabold text-ink">
            What do you need?
          </Text>
          <Text className="mt-1 text-sm text-muted">
            Your everyday payments, made easy.
          </Text>
        </View>
        <Text className="text-[22px] text-amber">✦</Text>
      </View>
      <View className="mt-2 flex-row items-stretch justify-between w-full gap-2">
        {services.map((service) => (
          <Pressable
            key={service.title}
            accessibilityRole="button"
            accessibilityLabel={`${service.title}, ${service.subtitle}`}
            onPress={() => router.push(service.href)}
            className="relative min-h-32.5 flex-1 overflow-hidden rounded-xl border border-line bg-white px-3 py-3 active:opacity-80"
            style={{
              borderColor: `${service.tint}2A`,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View
              pointerEvents="none"
              className="absolute -right-7 -top-6 h-[120px] w-[120px] rounded-full"
              style={{ backgroundColor: `${service.tint}12` }}
            />
            <View className="z-10 flex-row items-center justify-between">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  backgroundColor: `${service.tint}12`,
                  borderColor: `${service.tint}22`,
                }}
              >
                <MaterialIcons
                  name={service.icon}
                  size={22}
                  color={service.tint}
                />
              </View>
              <View
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: `${service.tint}14` }}
              >
                <MaterialIcons
                  name={service.accent}
                  size={15}
                  color={service.tint}
                />
              </View>
            </View>

            <View className="z-10 mt-6 gap-1.5">
              <Text className="text-lg font-extrabold text-ink">
                {service.title}
              </Text>
              <Text
                className="text-[10px] font-bold uppercase tracking-[0.7px]"
                style={{ color: service.tint }}
              >
                {service.subtitle}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="mt-4">
        <SectionTitle
          title="Recent activity"
          action="See all"
          onPress={() => router.push("/(tabs)/history")}
        />
      </View>
      <View className="rounded-xl border border-gray-300 bg-white px-4">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </View>
      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
