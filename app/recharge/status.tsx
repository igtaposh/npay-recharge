import type { ApiTransaction } from "../../data/api-types";
import { api, errorMessage } from "../../data/api";
import { usePaymentSound } from "@/hooks/usePaymentSound";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import {
  useRecharge,
  type TransactionStatus,
} from "../../components/recharge-context";
import { Button, Card, Page } from "../../components/ui";
import { providerInitials } from "../../data/dth";

import { prepaidPlans } from "../../data/prepaid-plans";

const operatorLogos: Record<string, ImageSourcePropType> = {
  jio: require("../../assets/company-logos/jio.png"),
  airtel: require("../../assets/company-logos/airtel.png"),
  vi: require("../../assets/company-logos/vi.png"),
  bsnl: require("../../assets/company-logos/bsnl.png"),
};

const dthLogos: Record<string, ImageSourcePropType> = {
  "airtel-dth": require("../../assets/company-logos/airtel-digital-tv.png"),
  dishtv: require("../../assets/company-logos/dishtv.png"),
};

const googlePlayLogo = require("../../assets/company-logos/google-play.png");


function statusMeta(status: TransactionStatus) {
  if (status === "Successful") {
    return {
      icon: "check-circle" as const,
      color: "#0550DD",
      soft: "#EAF1FF",
      title: "Payment successful",
      subtitle: "Your recharge request has been processed.",
    };
  }
  if (status === "Failed") {
    return {
      icon: "cancel" as const,
      color: "#B54755",
      soft: "#FDEBEE",
      title: "Payment failed",
      subtitle: "No money was deducted from your wallet.",
    };
  }
  return {
    icon: "hourglass-top" as const,
    color: "#C47716",
    soft: "#FFF2DE",
    title: "Payment pending",
    subtitle: "We’re waiting for provider confirmation.",
  };
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

function ProcessingRipple({
  index,
  ring,
  settle,
}: {
  index: number;
  ring: SharedValue<number>;
  settle: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const local = Math.max(0, Math.min(1, ring.value - index * 0.18));
    return {
      opacity: interpolate(local, [0, 1], [0.35, 0]) * (1 - settle.value),
      transform: [
        { scale: interpolate(local, [0, 1], [0.75, 1.55 + index * 0.12]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: 112,
          width: 112,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: "#0550DD",
        },
        style,
      ]}
    />
  );
}

export default function RechargeStatusScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const { getTransaction, refreshBalance } = useRecharge();
  const [loadError, setLoadError] = useState("");
  const [receipt, setReceipt] = useState<ApiTransaction | null>(null);
  const [retry, setRetry] = useState(0);
  const { playSuccessSound } = usePaymentSound();
  const params = useLocalSearchParams<{
    transactionId?: string;
    service?: string;
    phone?: string;
    operator?: string;
    operatorName?: string;
    circle?: string;
    amount?: string;
    planId?: string;
    subscriber?: string;
    customerName?: string;
    planName?: string;
  }>();

  const service =
    params.service === "dth" || params.service === "google-play"
      ? params.service
      : "prepaid";
  const phone = receipt?.service === "prepaid" ? receipt.recipient || "" : typeof params.phone === "string" ? params.phone : "";
  const subscriber =
    receipt?.service === "dth" ? receipt.recipient || "" : typeof params.subscriber === "string" ? params.subscriber : "";
  const operatorId = (
    typeof params.operator === "string" ? params.operator : "jio"
  ).toLowerCase();
  const operatorName =
    typeof params.operatorName === "string"
      ? params.operatorName
      : service === "dth"
        ? "DTH"
        : "Jio";
  const circle =
    typeof params.circle === "string" ? params.circle : "West Bengal";
  const amount = receipt ? Number(receipt.amount) : Number(
    typeof params.amount === "string" ? params.amount : "0",
  );
  const planId = typeof params.planId === "string" ? params.planId : "";
  const customerName =
    typeof params.customerName === "string" ? params.customerName : "";
  const planName = typeof params.planName === "string" ? params.planName : "";
  const plan = useMemo(
    () => prepaidPlans.find((item) => item.id === planId),
    [planId],
  );
  const operatorLogo = operatorLogos[operatorId] ?? operatorLogos.jio;
  const serviceTitle =
    service === "prepaid"
      ? `${operatorName} prepaid`
      : service === "dth"
        ? operatorName
        : "Google Play code";
  const recipientLabel =
    service === "prepaid" ? "Mobile number" : "Consumer number";
  const recipientValue =
    service === "prepaid"
      ? phone
        ? `${phone}`
        : "—"
      : service === "dth"
        ? subscriber || "—"
        : "Google Play Code";
  const serviceIcon =
    service === "prepaid" ? operatorLogo : (dthLogos[operatorId] ?? null);

  const [phase, setPhase] = useState<"processing" | "settled">("processing");
  const [resultStatus, setResultStatus] =
    useState<TransactionStatus>("Successful");
  const transactionId = typeof params.transactionId === "string" ? params.transactionId : null;
  const [redeemCode, setRedeemCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settle = useSharedValue(0);
  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);
  const ring = useSharedValue(0);

  const centerY = Math.max(height * 0.28, 180);
  const settledY = 28;
  const meta = statusMeta(resultStatus);

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

  useEffect(() => {
    let active=true;
    void (async()=>{
      try {
        if(!transactionId)throw new Error("Transaction reference is missing.");
        const transaction=await getTransaction(transactionId);
        if(!active)return;
        setLoadError("");setReceipt(transaction);setResultStatus(transaction.status);
        if(transaction.status==="Successful")playSuccessSound();
        if(transaction.category==="google-play"&&transaction.status==="Successful"){
          const code=await api.request<{code:string}>(`transactions/${transactionId}/gift-code`);
          if(active)setRedeemCode(code.data.code);
        }
        await refreshBalance();
      }catch(error){if(active)setLoadError(errorMessage(error));}
      finally{if(active){cancelAnimation(spin);settle.value=withTiming(1,{duration:reduceMotion?0:380});setPhase("settled");}}
    })();
    return ()=>{active=false;};
  },[transactionId,getTransaction,refreshBalance,playSuccessSound,settle,spin,reduceMotion,retry]);

  useEffect(()=>{
    if(phase!=="settled" || resultStatus!=="Pending" || loadError)return;
    const timer=setTimeout(()=>setRetry(value=>value+1),10000);
    return()=>clearTimeout(timer);
  },[phase,resultStatus,loadError,retry]);

  const iconStageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(settle.value, [0, 1], [centerY, settledY]);
    const scale = interpolate(settle.value, [0, 1], [1, 0.82]);
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
    opacity: interpolate(settle.value, [0, 1], [1, 0]),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.08]) }],
    opacity: interpolate(settle.value, [0, 1], [1, 0]),
  }));

  const settledIconStyle = useAnimatedStyle(() => ({
    opacity: settle.value,
    transform: [{ scale: interpolate(settle.value, [0, 1], [0.7, 1]) }],
  }));

  if (loadError) return <Page><Card><Text className="text-sm text-danger">{loadError}</Text><Button label="Refresh status" onPress={()=>setRetry(current=>current+1)} /></Card></Page>;

  return (
    <Page scroll={phase === "settled"}>
      {receipt?.provider_message ? <Text className="text-center text-sm text-muted">{receipt.provider_message}</Text> : null}
      <View className="flex-1">
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
              zIndex: 2,
            },
            iconStageStyle,
          ]}
        >
          <View className="h-36 w-36 items-center justify-center">
            <ProcessingRipple index={0} ring={ring} settle={settle} />
            <ProcessingRipple index={1} ring={ring} settle={settle} />
            <ProcessingRipple index={2} ring={ring} settle={settle} />

            <Animated.View
              style={[
                {
                  position: "absolute",
                  height: 118,
                  width: 118,
                  borderRadius: 999,
                  borderWidth: 3,
                  borderColor: "#B7CFFF",
                  borderTopColor: "#0550DD",
                  borderRightColor: "#8CB1FF",
                },
                spinnerStyle,
              ]}
            />

            <Animated.View
              style={[
                {
                  height: 88,
                  width: 88,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#EAF1FF",
                  borderWidth: 1,
                  borderColor: "#D6E4FF",
                },
                pulseStyle,
              ]}
            >
              <Text className="text-[28px] font-extrabold tracking-[-1px] text-green">
                n
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  height: 88,
                  width: 88,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: meta.soft,
                  borderWidth: 1,
                  borderColor: `${meta.color}33`,
                },
                settledIconStyle,
              ]}
            >
              <MaterialIcons name={meta.icon} size={42} color={meta.color} />
            </Animated.View>
          </View>
        </Animated.View>

        {phase === "processing" ? (
          <View className="flex-1 items-center justify-end pb-16">
            <Text className="text-center text-[22px] font-extrabold tracking-[-0.4px] text-ink">
              {service === "google-play"
                ? "Creating your gift code"
                : "Processing recharge"}
            </Text>
            <Text className="mt-2 px-8 text-center text-[14px] leading-5 text-muted">
              Paying ₹{amount.toLocaleString("en-IN")} · {recipientValue}
            </Text>
            <Text className="mt-5 text-center text-[12px] font-medium text-muted">
              Please wait · do not press back
            </Text>
          </View>
        ) : (
          <View className="flex-1 pt-40">
            <View className="items-center gap-2 px-2 pb-4">
              <Text className="text-center text-[24px] font-extrabold tracking-[-0.5px] text-ink">
                {meta.title}
              </Text>
              <Text className="text-center text-[14px] leading-5 text-muted">
                {service === "google-play" && resultStatus === "Successful"
                  ? "Your gift code is ready below. Save it before you leave."
                  : meta.subtitle}
              </Text>
              <View
                className="mt-1 rounded-full px-3 py-1.5"
                style={{ backgroundColor: meta.soft }}
              >
                <Text
                  className="text-[11px] font-extrabold uppercase tracking-[0.7px]"
                  style={{ color: meta.color }}
                >
                  {resultStatus}
                </Text>
              </View>
            </View>

            {service === "google-play" &&
            resultStatus === "Successful" &&
            redeemCode ? (
              <View className="relative overflow-hidden rounded-xl border border-[#DCD3FF] bg-[#F6F3FF] p-5">
                <View
                  pointerEvents="none"
                  className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#7157C8]/10"
                />
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
                        ₹{amount.toLocaleString("en-IN")}
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
                    className={`min-h-12.5 flex-row items-center justify-center gap-2 rounded-[15px] border ${
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
                    Use it in Google Play under Payments &amp; subscriptions →
                    Redeem gift code.
                  </Text>
                </View>
              </View>
            ) : null}

            <Card className="gap-0 mt-4 p-4">
              {service !== "google-play" && (
                <View className="mb-1 flex-row items-center gap-3.5 border-b border-gray-300 pb-3.5">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white">
                    {serviceIcon ? (
                      <Image
                        accessibilityLabel={`${serviceTitle} logo`}
                        source={serviceIcon}
                        style={{ width: 34, height: 34, resizeMode: "contain" }}
                      />
                    ) : (
                      <Text className="text-sm font-extrabold text-green">
                        {providerInitials(
                          service === "dth" ? operatorName : "TV",
                        )}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
                      Amount
                    </Text>
                    <Text className="text-[26px] font-extrabold tracking-[-0.6px] text-ink">
                      ₹{amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>
              )}

              <DetailRow label="Service" value={serviceTitle} />
              {service !== "google-play" && (
                <DetailRow label={recipientLabel} value={recipientValue} />
              )}
              {service === "prepaid" ? (
                <>
                  <DetailRow label="Operator" value={operatorName} />
                  <DetailRow label="Circle" value={circle} />
                  <DetailRow
                    label="Plan"
                    value={
                      plan
                        ? `${plan.data} · ${plan.validity}`
                        : `₹${amount.toLocaleString("en-IN")}`
                    }
                  />
                </>
              ) : null}
              {service === "dth" ? (
                <>
                  <DetailRow label="Provider" value={operatorName} />
                  {customerName ? (
                    <DetailRow label="Customer" value={customerName} />
                  ) : null}
                  {planName ? (
                    <DetailRow label="Monthly plan" value={planName} />
                  ) : null}
                </>
              ) : null}
              <DetailRow
                label="Transaction ID"
                value={transactionId ? `NP-${transactionId.slice(0, 10)}` : "—"}
                last
              />
            </Card>

            <View className="mt-auto gap-3 pt-5">
              {resultStatus === "Failed" ? (
                <Button
                  label="Try again"
                  onPress={() => {
                    if (service === "prepaid") {
                      router.replace({
                        pathname: "/recharge/prepaid",
                        params: {
                          phone,
                          operator: operatorId,
                          operatorName,
                          circle,
                        },
                      });
                    } else if (service === "dth") {
                      router.replace({
                        pathname: "/recharge/dth",
                        params: {
                          subscriber,
                          operator: operatorId,
                          operatorName,
                        },
                      });
                    } else {
                      router.replace("/recharge/google-play");
                    }
                  }}
                />
              ) : (
                <Button
                  label="Done"
                  onPress={() => router.replace("/(tabs)")}
                />
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  transactionId
                    ? router.replace(`/transaction/${transactionId}`)
                    : router.replace("/(tabs)/history")
                }
                className="min-h-12 items-center justify-center rounded-[17px] border border-line bg-white"
              >
                <Text className="text-base font-bold text-green">
                  View details
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Page>
  );
}
