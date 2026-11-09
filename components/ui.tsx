import type { ReactNode } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);

type TabName = "Home" | "History" | "Profile" | "Help";

const tabs = [
  { label: "Home", icon: "⌂", href: "/(tabs)" },
  { label: "History", icon: "◷", href: "/(tabs)/history" },
  { label: "Profile", icon: "○", href: "/(tabs)/profile" },
  { label: "Help", icon: "?", href: "/(tabs)/help" },
] as const;

export function Page({
  children,
  activeTab,
  scroll = true,
}: {
  children: ReactNode;
  activeTab?: TabName;
  scroll?: boolean;
}) {
  return (
    <StyledSafeAreaView className="flex-1 bg-canvas" edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="gap-5 px-[22px] pb-7 pt-4">{children}</View>
        </ScrollView>
      ) : (
        <View className="flex-1 gap-5 px-[22px] pb-7 pt-4">{children}</View>
      )}
      {activeTab ? <BottomNav activeTab={activeTab} /> : null}
    </StyledSafeAreaView>
  );
}

function BottomNav({ activeTab }: { activeTab: TabName }) {
  return (
    <View className="flex-row justify-around border-t border-line bg-white pb-1.5 pt-[11px]">
      {tabs.map((tab) => {
        const active = tab.label === activeTab;
        return (
          <Link key={tab.label} href={tab.href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="min-w-[62px] items-center justify-center gap-[3px] py-0.5"
            >
              <Text className={`text-[22px] leading-[25px] ${active ? "font-bold text-green" : "text-muted"}`}>{tab.icon}</Text>
              <Text className={`text-[11px] font-medium ${active ? "font-bold text-green" : "text-muted"}`}>{tab.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3.5">
      <View className="flex-1 gap-1">
        {eyebrow ? <Text className="text-xs font-bold uppercase tracking-[0.8px] text-green">{eyebrow}</Text> : null}
        <Text className="text-[27px] font-extrabold tracking-[-0.5px] text-ink">{title}</Text>
        {subtitle ? <Text className="text-sm leading-5 text-muted">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-[22px] border border-line bg-white p-[18px] ${className}`}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  const buttonClass =
    variant === "primary"
      ? "bg-green"
      : variant === "secondary"
        ? "bg-green-light"
        : "border border-line bg-white";
  const textClass = variant === "primary" ? "text-white" : "text-green";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[50px] items-center justify-center rounded-[15px] px-[18px] active:opacity-80 disabled:opacity-45 ${buttonClass}`}
    >
      <Text className={`text-[15px] font-bold ${textClass}`}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
  secureTextEntry = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  error?: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[13px] font-bold text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A4B0B4"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        className={`min-h-[52px] rounded-[14px] border bg-white px-[15px] text-[15px] text-ink ${error ? "border-danger" : "border-line"}`}
      />
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-extrabold text-ink">{title}</Text>
      {action && onPress ? (
        <Pressable accessibilityRole="button" onPress={onPress}>
          <Text className="text-[13px] font-bold text-green">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
