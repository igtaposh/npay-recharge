import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Platform, Pressable, Text, View } from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { Card, Page, PageHeading } from "../../components/ui";

const googlePlayLogo = require("../../assets/company-logos/google-play.png");

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions } = useRecharge();
  const transaction = transactions.find((item) => item.id === id);
  const [redeemCode, setRedeemCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  async function copyRedeemCode() {
    if (!redeemCode) return;

    try {
      await Clipboard.setStringAsync(redeemCode, {
        android: { isSensitive: true },
      });
      setCodeCopied(true);
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setCodeCopied(false);
    }
  }

  if (!transaction) {
    return (
      <Page>
        <PageHeading
          eyebrow="TRANSACTION"
          title="Not found"
          subtitle="This transaction is no longer available."
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="min-h-[54px] items-center justify-center rounded-[17px] bg-green"
        >
          <Text className="text-base font-bold text-white">Go back</Text>
        </Pressable>
      </Page>
    );
  }

  const isWalletCredit = transaction.category === "wallet";
  const companyLogo = getCompanyLogo(transaction.title, transaction.subtitle);
  const amountPrefix = isWalletCredit ? "+" : "−";

  return (
    <Page>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        className="h-11 w-11 items-center justify-center rounded-[15px] border border-line bg-white"
      >
        <MaterialIcons name="arrow-back" size={22} color="#172B4D" />
      </Pressable>
      <PageHeading
        eyebrow={
          transaction.category === "google-play"
            ? transaction.status == "Successful"
              ? "Successfull"
              : "Pending"
            : "TRANSACTION DETAILS"
        }
        title={isWalletCredit ? "Wallet top-up" : "Recharge"}
        subtitle={
          transaction.category === "google-play"
            ? transaction.subtitle
            : "Google Play Code"
        }
      />
      <View className="items-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-7">
        <View
          className={`h-16 w-16 items-center justify-center rounded-[22px] ${isWalletCredit ? "bg-green-light" : "bg-[#EEF4FF]"}`}
        >
          {isWalletCredit ? (
            <MaterialIcons
              name="account-balance-wallet"
              size={30}
              color="#168A73"
            />
          ) : companyLogo ? (
            <Image
              accessibilityLabel={`${transaction.title} logo`}
              source={companyLogo}
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />
          ) : (
            <MaterialIcons name="receipt-long" size={30} color="#0550DD" />
          )}
        </View>
        <Text className="text-center text-[17px] font-bold text-ink">
          {transaction.title}
        </Text>
        <Text
          className={`text-[34px] font-extrabold tracking-[-0.8px] ${isWalletCredit ? "text-green" : "text-ink"}`}
        >
          {amountPrefix} ₹{transaction.amount.toLocaleString("en-IN")}
        </Text>
        <View
          className={`rounded-full px-3 py-1.5 ${
            transaction.status === "Successful"
              ? "bg-green-light"
              : transaction.status === "Failed"
                ? "bg-[#FDEBEE]"
                : "bg-[#FFF3DB]"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              transaction.status === "Successful"
                ? "text-green"
                : transaction.status === "Failed"
                  ? "text-danger"
                  : "text-[#A36812]"
            }`}
          >
            {transaction.status}
          </Text>
        </View>
      </View>

      {transaction.category === "google-play" && (
        <View className="z-10 gap-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl border border-[#E4DBFF] bg-white">
              <Image
                accessibilityLabel="Google Play logo"
                source={googlePlayLogo}
                style={{ width: 30, height: 30, resizeMode: "contain" }}
              />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-[#7157C8]">
                Your gift code
              </Text>
              <Text className="text-[15px] font-extrabold text-ink">
                Ready to redeem
              </Text>
            </View>
            <View className="">
              <Text className="text-2xl font-extrabold text-[#7157C8]">
                ₹{transaction.amount.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          <View className="items-center gap-2 rounded-xl border border-dashed border-[#B7A6EE] bg-white px-4 py-5">
            <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
              Redeem code
            </Text>
            <Text
              selectable
              numberOfLines={1}
              className="text-[18px] font-extrabold tracking-[1px] text-ink"
              style={{
                fontFamily: Platform.select({
                  ios: "Menlo",
                  android: "monospace",
                  default: "monospace",
                }),
              }}
            >
              {redeemCode}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              codeCopied ? "Redeem code copied" : "Copy redeem code"
            }
            onPress={copyRedeemCode}
            className={`min-h-[50px] flex-row items-center justify-center gap-2 rounded-[15px] border ${
              codeCopied
                ? "border-green bg-green-light"
                : "border-[#7157C8] bg-[#7157C8]"
            }`}
          >
            <MaterialIcons
              name={codeCopied ? "check" : "content-copy"}
              size={18}
              color={codeCopied ? "#0550DD" : "#FFFFFF"}
            />
            <Text
              className={`text-sm font-bold ${
                codeCopied ? "text-green" : "text-white"
              }`}
            >
              {codeCopied ? "Copied to clipboard" : "Copy code"}
            </Text>
          </Pressable>

          <Text className="text-center text-[11px] leading-4.5 text-muted">
            Use it in Google Play under Payments &amp; subscriptions → Redeem
            gift code.
          </Text>
        </View>
      )}

      <Card className="gap-0">
        <DetailRow
          label="Transaction type"
          value={isWalletCredit ? "Wallet credit" : "Recharge payment"}
        />
        <DetailRow
          label={isWalletCredit ? "Paid using" : "Paid from"}
          value={isWalletCredit ? "UPI" : "NPay wallet"}
        />
        <DetailRow label="Date & time" value={transaction.date} />
        <DetailRow label="Transaction ID" value={`NP-${transaction.id}`} last />
      </Card>
    </Page>
  );
}

function getCompanyLogo(
  title: string,
  subtitle: string,
): ImageSourcePropType | null {
  const transactionLabel = `${title} ${subtitle}`.toLowerCase();

  if (transactionLabel.includes("google")) {
    return require("../../assets/company-logos/google-play.png");
  }
  if (transactionLabel.includes("jio")) {
    return require("../../assets/company-logos/jio.png");
  }
  if (transactionLabel.includes("bsnl")) {
    return require("../../assets/company-logos/bsnl.png");
  }
  if (/\bvi\b/.test(transactionLabel)) {
    return require("../../assets/company-logos/vi.png");
  }
  if (
    transactionLabel.includes("dish tv") ||
    transactionLabel.includes("dishtv")
  ) {
    return require("../../assets/company-logos/dishtv.png");
  }
  if (transactionLabel.includes("airtel") && transactionLabel.includes("dth")) {
    return require("../../assets/company-logos/airtel-digital-tv.png");
  }
  if (transactionLabel.includes("airtel")) {
    return require("../../assets/company-logos/airtel.png");
  }

  return null;
}

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
      className={`flex-row items-start justify-between gap-4 py-4 ${last ? "" : "border-b border-gray-300"}`}
    >
      <Text className="flex-1 text-[13px] text-muted">{label}</Text>
      <Text className="max-w-[62%] text-right text-[13px] font-semibold text-ink">
        {value}
      </Text>
    </View>
  );
}
