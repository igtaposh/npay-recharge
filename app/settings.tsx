import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Page, PageHeading } from "../components/ui";

const settings = [
  { title: "Notifications", detail: "Recharge reminders and offers", icon: "◉" },
  { title: "Privacy & security", detail: "Manage your security preferences", icon: "◇" },
  { title: "Language", detail: "English", icon: "文" },
  { title: "About NPay", detail: "Version 1.0.0 · Demo app", icon: "i" },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Page>
      <PageHeading eyebrow="PREFERENCES" title="Settings" subtitle="Make NPay work the way you like." />
      <View className="rounded-[20px] bg-white px-[15px]">
        {settings.map((item, index) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={() => index === 3 ? router.push("/(tabs)/help") : undefined}
            className={`flex-row items-center gap-[13px] py-4 ${index < settings.length - 1 ? "border-b border-line" : ""}`}
          >
            <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-green-light"><Text className="text-[17px] font-bold text-green">{item.icon}</Text></View>
            <View className="flex-1 gap-1">
              <Text className="text-[13px] font-bold text-ink">{item.title}</Text>
              <Text className="text-[11px] text-muted">{item.detail}</Text>
            </View>
            <Text className="text-[22px] text-muted">›</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push("/login")} className="mt-1 items-center rounded-2xl bg-[#FBEDEC] p-[17px]">
        <Text className="text-[13px] font-bold text-danger">Log in or switch account</Text>
      </Pressable>
      <Text className="text-center text-[11px] text-muted">Settings in this prototype are for display only.</Text>
    </Page>
  );
}
