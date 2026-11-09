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
    <Page activeTab="Profile">
      <PageHeading eyebrow="YOUR ACCOUNT" title="Profile" subtitle="Keep your account details up to date." />
      <Card className="flex-row items-center gap-4 p-5">
        <View className="h-[60px] w-[60px] items-center justify-center rounded-[22px] bg-green"><Text className="text-2xl font-extrabold text-white">A</Text></View>
        <View className="gap-1">
          <Text className="text-lg font-extrabold text-ink">Alex Morgan</Text>
          <Text className="text-[13px] text-muted">+91 98765 43210</Text>
          <Text className="mt-[3px] text-[11px] font-bold text-green">NPay member since 2024</Text>
        </View>
      </Card>
      <View className="rounded-[20px] bg-white px-[15px]">
        {options.map((option) => (
          <Pressable
            key={option.title}
            accessibilityRole="button"
            onPress={() => router.push(option.href)}
            className="flex-row items-center gap-[13px] border-b border-line py-[15px] last:border-b-0"
          >
            <View className="h-[39px] w-[39px] items-center justify-center rounded-[13px] bg-green-light"><Text className="text-[17px] font-bold text-green">{option.icon}</Text></View>
            <View className="flex-1 gap-[3px]">
              <Text className="text-[13px] font-bold text-ink">{option.title}</Text>
              <Text className="text-[11px] text-muted">{option.subtitle}</Text>
            </View>
            <Text className="text-[22px] text-muted">›</Text>
          </Pressable>
        ))}
      </View>
      <Card className="gap-2">
        <Text className="text-[15px] font-extrabold text-ink">Sign in to sync your account</Text>
        <Text className="text-xs text-muted">This preview keeps your details on this device.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push("/login")} className="pt-[5px]">
          <Text className="text-[13px] font-extrabold text-green">Log in or create account  →</Text>
        </Pressable>
      </Card>
      <Text className="text-center text-[10px] tracking-[1px] text-muted">NPAY · VERSION 1.0.0 · DEMO</Text>
    </Page>
  );
}
