import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Card, Page, PageHeading } from "../components/ui";
import {
  commissionRates,
  earnPerThousand,
  type CommissionRate,
} from "../data/commissions";
import { providerInitials } from "../data/dth";

const companyLogos: Partial<Record<string, ImageSourcePropType>> = {
  jio: require("../assets/company-logos/jio.png"),
  airtel: require("../assets/company-logos/airtel.png"),
  vi: require("../assets/company-logos/vi.png"),
  bsnl: require("../assets/company-logos/bsnl.png"),
  "airtel-dth": require("../assets/company-logos/airtel-digital-tv.png"),
  dishtv: require("../assets/company-logos/dishtv.png"),
  "google-play": require("../assets/company-logos/google-play.png"),
};

function CompanyMark({ company }: { company: CommissionRate }) {
  const logo = companyLogos[company.id];

  return (
    <View className="h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white">
      {logo ? (
        <Image
          accessibilityLabel={`${company.company} logo`}
          source={logo}
          style={{ width: 24, height: 24, resizeMode: "contain" }}
        />
      ) : (
        <Text className="text-[11px] font-extrabold text-green">
          {providerInitials(company.company)}
        </Text>
      )}
    </View>
  );
}

export default function CommissionsScreen() {
  const router = useRouter();
  const topCompany = commissionRates.reduce(
    (best, company) => (company.rate > best.rate ? company : best),
    commissionRates[0],
  );
  const serviceCount = new Set(
    commissionRates.map((company) => company.category),
  ).size;

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
        eyebrow="PARTNER EARNINGS"
        title="Commissions"
        subtitle="Company-wise rates on every successful recharge."
      />

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            COMPANIES
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            {commissionRates.length}
          </Text>
          <Text className="text-xs text-muted">
            across {serviceCount} services
          </Text>
        </Card>
        <Card className="flex-1 gap-1.5 p-4">
          <Text className="text-[11px] font-extrabold tracking-[0.5px] text-muted">
            TOP RATE
          </Text>
          <Text className="text-2xl font-extrabold text-ink">
            {topCompany.rate.toFixed(1)}%
          </Text>
          <Text className="text-xs text-muted">{topCompany.company}</Text>
        </Card>
      </View>

      <View className="gap-3">
        <View className="gap-1">
          <Text className="text-xl font-extrabold text-ink">
            Company-wise rates
          </Text>
          <Text className="text-xs leading-5 text-muted">
            Earnings shown on every ₹1,000 recharge.
          </Text>
        </View>

        <View className="overflow-hidden rounded-xl border border-gray-300 bg-white">
          <View className="flex-row items-center gap-2.5 border-b border-line bg-[#F7F9FC] px-3.5 py-2.5">
            <Text className="flex-1 text-[9px] font-extrabold uppercase tracking-[0.7px] text-muted">
              Company
            </Text>
            <Text className="w-13 text-right text-[9px] font-extrabold uppercase tracking-[0.7px] text-muted">
              Rate
            </Text>
            <Text className="w-16 text-right text-[9px] font-extrabold uppercase tracking-[0.7px] text-muted">
              Earn
            </Text>
          </View>
          {commissionRates.map((company) => (
            <View
              key={company.id}
              className="flex-row items-center gap-2.5 border-b border-line px-3.5 py-3 last:border-b-0"
            >
              <CompanyMark company={company} />
              <View className="flex-1 gap-0.5">
                <Text
                  numberOfLines={1}
                  className="text-[14px] font-extrabold text-ink"
                >
                  {company.company}
                </Text>
                <Text className="text-[10px] font-medium text-muted">
                  {company.category}
                </Text>
              </View>
              <Text className="w-13 text-right text-[14px] font-extrabold text-green">
                {company.rate.toFixed(1)}%
              </Text>
              <Text className="w-16 text-right text-[13px] font-bold text-ink">
                ₹{earnPerThousand(company.rate)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Card className="flex-row items-start gap-3.5 p-4">
        <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-green-light">
          <MaterialIcons
            name="account-balance-wallet"
            size={20}
            color="#0550DD"
          />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-bold text-ink">
            Credited to your wallet
          </Text>
          <Text className="text-xs leading-5 text-muted">
            Commission is calculated on the recharge value and added to your
            NPay wallet after a successful recharge. Rates shown are demo
            values.
          </Text>
        </View>
      </Card>

      <Text className="text-center text-[11px] text-muted">
        © 2026 nPay · Developed by Taposh
      </Text>
    </Page>
  );
}
