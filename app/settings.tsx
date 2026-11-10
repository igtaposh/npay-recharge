import Ionicons from "@react-native-vector-icons/ionicons/static";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Page, PageHeading } from "../components/ui";

const settings = [
  {
    title: "Profile",
    detail: "View your informations",
    icon: <Ionicons name="person" size={20} />,
  },
  {
    title: "Notifications",
    detail: "Recharge reminders and offers",
    icon: <Ionicons name="notifications" size={20} />,
  },
  {
    title: "Privacy & security",
    detail: "Manage your security preferences",
    icon: <Ionicons name="lock-closed" size={20} />,
  },
  {
    title: "Language",
    detail: "English",
    icon: <Ionicons name="language-sharp" size={20} />,
  },
  {
    title: "Commisions",
    detail: "Know more about commisions",
    icon: <Ionicons name="podium" size={20} />,
  },
  {
    title: "Developer",
    detail: "Know more about us",
    icon: <Ionicons name="information-circle" size={25} />,
  },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Page>
      <PageHeading
        eyebrow="PREFERENCES"
        title="Settings"
        subtitle="Make NPay work the way you like."
      />
      <View className="rounded-xl border border-gray-300 bg-white px-4">
        {settings.map((item, index) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={() =>
              index === 3 ? router.push("/(tabs)/help") : undefined
            }
            className={`flex-row items-center gap-3.5 py-4 `}
          >
            <View className="h-15 w-15 items-center justify-center rounded-[15px] bg-green-light">
              <Text className="text-lg font-bold text-green">{item.icon}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-lg font-bold text-ink">{item.title}</Text>
              <Text className="text-sm text-muted">{item.detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={25} />
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log in or switch account"
        onPress={() => router.push("/login")}
        className="mt-1 flex-row items-center gap-3.5 rounded-xl border border-gray-300 bg-white p-4 active:opacity-80"
      >
        <View className="h-15 w-15 items-center justify-center rounded-xl bg-green-light">
          <Ionicons name="person-circle-outline" size={26} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-md font-bold text-red-800">
            Log out or switch account
          </Text>
          <Text className="text-sm text-muted">Manage your account access</Text>
        </View>
        <Ionicons name="chevron-forward" size={25} />
      </Pressable>
      <View className="gap-3 rounded-xl border border-gray-300 bg-white py-4 px-6">
        <View className="flex flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <View className="h-[21px] w-[19px] items-center justify-center rounded-[5px] bg-[#0550DD]">
              <Text className="text-[17px] font-extrabold leading-[20px] text-white">
                n
              </Text>
            </View>
            <Text className="text-[18px] font-extrabold tracking-[-0.7px] text-black">
              pay
            </Text>
          </View>
          <Text className="text-md font-bold text-green">v1.0.0</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-xs leading-[18px] text-muted">
            A app for Mobile, DTH, and Google Play recharges.
          </Text>
        </View>
        <View className="h-px bg-gray-300" />
        <View className="gap-1.5 mt-2">
          <Text className="text-sm font-extrabold uppercase tracking-[0.7px] text-ink">
            Terms & conditions
          </Text>
          <Text className="text-sm mt-2 leading-[18px] text-muted">
            By using this application, you acknowledge that you have read,
            understood, and agreed to our{" "}
            <Link className="text-green" href="/">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="text-green" href="/">
              Terms & Conditions
            </Link>
            . Your continued use of the application indicates your acceptance of
            these policies. If you do not agree with any of these terms, please
            discontinue using the application.
          </Text>
        </View>
      </View>
      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
