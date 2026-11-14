import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import type { Transaction } from "./recharge-context";

type BrandType = "jio" | "bsnl" | "google" | "wallet" | "default";

function getBrandMeta(transaction: Transaction): {
  type: BrandType;
  bg: string;
  border: string;
} {
  if (transaction.category === "wallet") {
    return {
      type: "wallet",
      bg: "#EAFBF3",
      border: "#BFEAD5",
    };
  }

  const haystack = `${transaction.title} ${transaction.subtitle}`.toLowerCase();

  if (haystack.includes("jio")) {
    return {
      type: "jio",
      bg: "#FDEDEE",
      border: "#F4C2C2",
    };
  }

  if (haystack.includes("bsnl")) {
    return {
      type: "bsnl",
      bg: "#EAF2FF",
      border: "#C7D9FF",
    };
  }

  if (haystack.includes("google")) {
    return {
      type: "google",
      bg: "#EAFBF3",
      border: "#BFEAD5",
    };
  }

  return {
    type: "default",
    bg: "#F2F7FF",
    border: "#DCE8FF",
  };
}

function BrandLogo({ type }: { type: BrandType }) {
  if (type === "jio") {
    return (
      <Image
        source={require("../assets/company-logos/jio.png")}
        style={{ width: 28, height: 28, resizeMode: "contain" }}
      />
    );
  }

  if (type === "bsnl") {
    return (
      <Image
        source={require("../assets/company-logos/bsnl.png")}
        style={{ width: 28, height: 28, resizeMode: "contain" }}
      />
    );
  }

  if (type === "google") {
    return (
      <Image
        source={require("../assets/company-logos/google-play.png")}
        style={{ width: 28, height: 28, resizeMode: "contain" }}
      />
    );
  }

  if (type === "wallet") {
    return (
      <MaterialIcons name="account-balance-wallet" size={24} color="#168A73" />
    );
  }

  return (
    <Text style={{ fontSize: 18, fontWeight: "800", color: "#1761DF" }}>↗</Text>
  );
}

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  const brand = getBrandMeta(transaction);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${transaction.title}`}
      onPress={() => router.push(`/transaction/${transaction.id}`)}
      className="flex-row items-center gap-3.5 border-b border-gray-300 py-4"
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-xl border"
        style={{
          backgroundColor: brand.bg,
          borderColor: brand.border,
        }}
      >
        <BrandLogo type={brand.type} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-[15px] font-bold text-ink">
          {transaction.title}
        </Text>
        <Text className="text-xs text-muted">{transaction.subtitle}</Text>
        <Text className="text-[11px] text-muted">{transaction.date}</Text>
      </View>
      <View className="items-end gap-1">
        <Text
          className={`text-sm font-bold ${transaction.category === "wallet" ? "text-green" : "text-ink"}`}
        >
          {transaction.category === "wallet" ? "+" : "−"} ₹
          {transaction.amount.toLocaleString("en-IN")}
        </Text>
        <Text
          className={`text-[11px] font-bold ${
            transaction.status === "Successful"
              ? "text-green"
              : transaction.status === "Failed"
                ? "text-danger"
                : "text-amber"
          }`}
        >
          {transaction.status}
        </Text>
      </View>
    </Pressable>
  );
}
