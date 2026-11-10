import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Page, PageHeading } from "../../components/ui";

const options = [
  { icon: "♙", title: "Personal information", subtitle: "Your name, phone and email", href: "/settings" },
  { icon: "▤", title: "Saved operators", subtitle: "Manage your connections", href: "/recharge/prepaid" },
  { icon: "⚙", title: "Settings", subtitle: "Preferences and security", href: "/settings" },
] as const;

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Page>
      <PageHeading eyebrow="YOUR ACCOUNT" title="Profile" subtitle="Keep your account details up to date." />
      <Card className="flex-row items-center gap-4 p-5">
        <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-green"><Text className="text-[27px] font-extrabold text-white">A</Text></View>
        <View className="gap-1">
          <Text className="text-xl font-extrabold text-ink">Alex Morgan</Text>
          <Text className="text-sm text-muted">+91 98765 43210</Text>
          <Text className="mt-1 text-xs font-bold text-green">NPay member since 2024</Text>
        </View>
      </Card>
      <View className="rounded-[24px] border border-line bg-white px-4">
        {options.map((option) => (
          <Pressable
            key={option.title}
            accessibilityRole="button"
            onPress={() => router.push(option.href)}
            className="flex-row items-center gap-3.5 border-b border-line py-4 last:border-b-0"
          >
            <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-green-light"><Text className="text-lg font-bold text-green">{option.icon}</Text></View>
            <View className="flex-1 gap-1">
              <Text className="text-sm font-bold text-ink">{option.title}</Text>
              <Text className="text-xs text-muted">{option.subtitle}</Text>
            </View>
            <Text className="text-[22px] text-muted">›</Text>
          </Pressable>
        ))}
      </View>
      <Card className="gap-2">
        <Text className="text-base font-extrabold text-ink">Sign in to sync your account</Text>
        <Text className="text-[13px] leading-5 text-muted">This preview keeps your details on this device.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push("/login")} className="pt-1">
          <Text className="text-sm font-extrabold text-green">Log in or create account  →</Text>
        </Pressable>
      </Card>
      <Text className="text-center text-xs tracking-[0.8px] text-muted">NPAY · VERSION 1.0.0 · DEMO</Text>
    </Page>
  );
}
