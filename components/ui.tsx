import { styled } from "nativewind";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Animated as NativeAnimated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

export function Page({
  children,
  scroll = true,
}: {
  children: ReactNode;
  scroll?: boolean;
}) {
  return (
    <StyledSafeAreaView className="flex-1 bg-canvas" edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-[22px] px-5 pb-8 pt-5">{children}</View>
        </ScrollView>
      ) : (
        <View className="flex-1 gap-[22px] px-5 pb-8 pt-5">{children}</View>
      )}
    </StyledSafeAreaView>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <View className={`rounded-full bg-[#E7ECF3] ${className}`} />;
}

export function AppStartupSkeleton() {
  return (
    <StyledSafeAreaView
      accessibilityLabel="Loading NPay"
      accessibilityRole="progressbar"
      className="flex-1 bg-canvas"
      edges={["top", "bottom"]}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-[22px] px-5 pb-8 pt-5">
          <View className="flex-row items-center gap-3.5 py-1">
            <SkeletonBlock className="h-12 w-12 rounded-[17px]" />
            <View className="flex-1 gap-2">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-6 w-40" />
            </View>
            <SkeletonBlock className="h-12 w-12 rounded-[18px]" />
          </View>

          <View className="min-h-[210px] justify-between rounded-[28px] bg-[#DCE7F5] p-[22px]">
            <View className="flex-row items-center justify-between">
              <SkeletonBlock className="h-3 w-32 bg-white/70" />
              <SkeletonBlock className="h-10 w-10 rounded-[14px] bg-white/70" />
            </View>
            <View className="gap-3">
              <SkeletonBlock className="h-10 w-48 bg-white/80" />
              <SkeletonBlock className="h-3 w-32 bg-white/70" />
              <SkeletonBlock className="h-10 w-32 rounded-[14px] bg-white/80" />
            </View>
          </View>

          <View className="gap-2">
            <SkeletonBlock className="h-6 w-48" />
            <SkeletonBlock className="h-4 w-56" />
          </View>
          <View className="-mt-2 gap-3">
            {["prepaid", "dth", "play"].map((service) => (
              <View
                key={service}
                className="min-h-[104px] flex-row items-center justify-between rounded-[24px] border border-line bg-white px-5 py-4"
              >
                <View className="flex-1 gap-3">
                  <SkeletonBlock className="h-4 w-1/2" />
                  <SkeletonBlock className="h-3 w-32" />
                  <SkeletonBlock className="h-3 w-24" />
                </View>
                <SkeletonBlock className="h-[68px] w-[68px] rounded-[24px] bg-[#EDF1F7]" />
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-14" />
          </View>
          <View className="gap-4 rounded-[22px] border border-line bg-white p-4">
            {[0, 1].map((item) => (
              <View key={item} className="flex-row items-center gap-3">
                <SkeletonBlock className="h-12 w-12 rounded-[17px]" />
                <View className="flex-1 gap-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-40" />
                </View>
                <SkeletonBlock className="h-4 w-14" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </StyledSafeAreaView>
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
    <View className="relative overflow-hidden rounded-xl border border-gray-300 bg-white px-5 py-5">
      <View
        pointerEvents="none"
        className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-green-light"
      />
      <View className="z-10 flex-row items-start justify-between gap-3.5">
        <View className="flex-1 gap-2">
          {eyebrow ? (
            <View className="flex-row items-center self-start gap-2 rounded-full bg-green-light px-3 py-1.5">
              <View className="h-1.5 w-1.5 rounded-full bg-green" />
              <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-green">
                {eyebrow}
              </Text>
            </View>
          ) : null}
          <Text
            accessibilityRole="header"
            className="text-[28px] font-extrabold tracking-[-0.7px] text-ink"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-sm leading-[21px] text-muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`rounded-xl border border-gray-300 bg-white p-5 ${className}`}
    >
      {children}
    </View>
  );
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
  const reduceMotion = useReducedMotion();
  const [pressScale] = useState(() => new NativeAnimated.Value(1));

  return (
    <NativeAnimated.View style={{ transform: [{ scale: pressScale }] }}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          if (!reduceMotion && !disabled) {
            NativeAnimated.spring(pressScale, {
              toValue: 0.98,
              speed: 28,
              bounciness: 2,
              useNativeDriver: true,
            }).start();
          }
        }}
        onPressOut={() => {
          NativeAnimated.spring(pressScale, {
            toValue: 1,
            speed: 28,
            bounciness: 2,
            useNativeDriver: true,
          }).start();
        }}
        className={`min-h-[54px] items-center justify-center rounded-[17px] px-5 disabled:opacity-45 ${buttonClass}`}
      >
        <Text className={`text-base font-bold ${textClass}`}>{label}</Text>
      </Pressable>
    </NativeAnimated.View>
  );
}

export function Field({
  maxLength,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
  secureTextEntry = false,
}: {
  maxLength: number;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?:
    | "default"
    | "phone-pad"
    | "numeric"
    | "email-address"
    | "visible-password";
  error?: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View className="gap-2.5">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A98AB"
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        className={`min-h-18 p-4 bg-white rounded-2xl border text-lg tracking-widest text-ink ${error ? "border-danger" : "border-line"}`}
      />
      {error ? (
        <Text className="text-[13px] leading-5 text-danger">{error}</Text>
      ) : null}
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
      <Text className="text-xl font-extrabold text-ink">{title}</Text>
      {action && onPress ? (
        <Pressable accessibilityRole="button" onPress={onPress}>
          <Text className="text-sm font-bold text-green">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
