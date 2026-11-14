import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import { Card, Page, PageHeading } from "../components/ui";
import { developerProfile } from "../data/developer";

type SocialIcon = "logo-github" | "logo-instagram";

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start justify-between gap-4 py-3.5 ${
        last ? "" : "border-b border-gray-300"
      }`}
    >
      <Text className="flex-1 text-[13px] text-muted">{label}</Text>
      <Text className="max-w-[62%] text-right text-[13px] font-semibold text-ink">
        {value}
      </Text>
    </View>
  );
}

function SocialRow({
  icon,
  label,
  handle,
  url,
  last = false,
}: {
  icon: SocialIcon;
  label: string;
  handle: string;
  url: string;
  last?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${label} profile for ${handle}`}
      onPress={() => {
        void Linking.openURL(url);
      }}
      className={`flex-row items-center gap-3.5 py-4 ${
        last ? "" : "border-b border-gray-300"
      }`}
    >
      <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-green-light">
        <Ionicons name={icon} size={22} color="#0550DD" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-sm font-bold text-ink">{label}</Text>
        <Text className="text-xs font-medium text-muted">{handle}</Text>
      </View>
      <MaterialIcons name="open-in-new" size={18} color="#68788F" />
    </Pressable>
  );
}

export default function DeveloperScreen() {
  const router = useRouter();

  return (
    <Page>
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-[15px] border border-line bg-white"
        >
          <MaterialIcons name="arrow-back" size={22} color="#172B4D" />
        </Pressable>
        <WalletBalanceBar />
      </View>

      <PageHeading
        eyebrow="BEHIND NPAY"
        title="Developer"
        subtitle="A little about the person behind the app."
      />

      <Card className="items-center gap-3 py-7">
        <View className="h-20 w-20 items-center justify-center rounded-[26px] border-4 border-green-light bg-[#DCE8FF]">
          <Text className="text-[30px] font-extrabold text-green">
            {developerProfile.name.slice(0, 1)}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="text-[24px] font-extrabold tracking-[-0.5px] text-ink">
            {developerProfile.name}
          </Text>
          <Text className="text-sm font-medium text-muted">
            {developerProfile.role}
          </Text>
        </View>
        <Text className="max-w-[280px] text-center text-[13px] leading-5 text-muted">
          Building a simpler way to recharge, pay and keep track of everyday
          spends.
        </Text>
      </Card>

      <View className="gap-3">
        <Text className="text-xl font-extrabold text-ink">
          Developer details
        </Text>
        <View className="rounded-xl border border-gray-300 bg-white px-4">
          <DetailRow label="Company" value={developerProfile.company} />
          <DetailRow label="Developer" value={developerProfile.name} />
          <DetailRow label="Role" value={developerProfile.role} />
          <DetailRow
            label="App version"
            value={`v${developerProfile.version}`}
            last
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xl font-extrabold text-ink">Find me online</Text>
        <View className="rounded-xl border border-gray-300 bg-white px-4">
          <SocialRow
            icon="logo-instagram"
            label="Instagram"
            handle={`@${developerProfile.instagram}`}
            url={`https://instagram.com/${developerProfile.instagram}`}
          />
          <SocialRow
            icon="logo-github"
            label="GitHub"
            handle={`@${developerProfile.github}`}
            url={`https://github.com/${developerProfile.github}`}
            last
          />
        </View>
      </View>

      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
