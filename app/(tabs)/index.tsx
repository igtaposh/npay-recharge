import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Page, SectionTitle } from "../../components/ui";
import { useRecharge } from "../../components/recharge-context";
import { TransactionRow } from "../../components/transaction-row";

const services = [
  { title: "Prepaid", subtitle: "Mobile recharge", icon: "▣", href: "/recharge/prepaid", color: "bg-[#E6F3EF]" },
  { title: "DTH", subtitle: "TV plans & top-ups", icon: "▤", href: "/recharge/dth", color: "bg-[#FFF1DC]" },
  { title: "Google Play", subtitle: "Gift codes", icon: "▷", href: "/recharge/google-play", color: "bg-[#EBEAFE]" },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { balance, transactions, refreshedAt, refreshBalance } = useRecharge();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Page activeTab="Home">
      <View className="flex-row items-center gap-3 py-[3px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push("/settings")}
          className="h-11 w-11 items-center justify-center rounded-[15px] border border-line bg-white"
        >
          <Text className="text-[19px] text-ink">⚙</Text>
        </Pressable>
        <View className="flex-1 gap-0.5">
          <Text className="text-[10px] font-bold tracking-[1px] text-muted">YOUR EVERYDAY PAYMENTS</Text>
          <Text className="text-xl font-extrabold text-ink">Hello, Alex <Text className="text-[17px] text-amber">✦</Text></Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push("/(tabs)/profile")}
          className="h-[43px] w-[43px] items-center justify-center rounded-2xl bg-green"
        >
          <Text className="text-[17px] font-extrabold text-white">A</Text>
        </Pressable>
      </View>

      <View className="relative min-h-[191px] gap-[7px] overflow-hidden rounded-[25px] bg-green p-[21px]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Text className="text-[11px] font-bold tracking-[1.1px] text-[#C9E6DE]">WALLET BALANCE</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showBalance ? "Hide balance" : "Show balance"}
              onPress={() => setShowBalance((visible) => !visible)}
            >
              <Text className="text-[15px] text-[#DDF0EA]">{showBalance ? "◉" : "◎"}</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Refresh wallet balance"
            onPress={refreshBalance}
            className="h-[34px] w-[34px] items-center justify-center rounded-xl bg-white/10"
          >
            <Text className="text-[22px] text-white">↻</Text>
          </Pressable>
        </View>
        <Text className="text-[34px] font-extrabold tracking-[-0.5px] text-white">{showBalance ? `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹ ••••••"}</Text>
        <Text className="text-[11px] text-[#C9E6DE]">{refreshedAt} · Safe & secure</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/wallet/add")}
          className="mt-[5px] self-start rounded-xl bg-white px-[13px] py-[9px]"
        >
          <Text className="text-xs font-extrabold text-green">＋  Add balance</Text>
        </Pressable>
        <View className="absolute -bottom-24 -right-14 h-[170px] w-[170px] rounded-full border-[30px] border-white/5" />
      </View>

      <View className="mt-0.5 flex-row items-center justify-between">
        <View>
          <Text className="text-[19px] font-extrabold text-ink">What do you need?</Text>
          <Text className="mt-1 text-xs text-muted">Your everyday payments, made easy.</Text>
        </View>
        <Text className="text-[22px] text-amber">✦</Text>
      </View>
      <View className="-mt-[7px] gap-2.5">
        {services.map((service) => (
          <Pressable
            key={service.title}
            accessibilityRole="button"
            onPress={() => router.push(service.href)}
            className="min-h-[76px] flex-row items-center gap-[13px] rounded-[19px] border border-line bg-white px-[14px] py-3 active:opacity-80"
          >
            <View className={`h-12 w-12 items-center justify-center rounded-2xl ${service.color}`}>
              <Text className="text-[21px] font-extrabold text-green">{service.icon}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-[15px] font-extrabold text-ink">{service.title}</Text>
              <Text className="text-xs text-muted">{service.subtitle}</Text>
            </View>
            <Text className="text-2xl text-muted">›</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-1">
        <SectionTitle
          title="Recent activity"
          action="See all"
          onPress={() => router.push("/(tabs)/history")}
        />
      </View>
      <View className="rounded-[20px] bg-white px-[15px]">
        {transactions.slice(0, 2).map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </View>
      <Text className="-mt-[7px] text-center text-[10px] text-muted">Demo wallet · No real payment is processed</Text>
    </Page>
  );
}
