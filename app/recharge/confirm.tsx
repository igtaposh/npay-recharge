import { newRequestKey, errorMessage } from "../../data/api";
import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { PinDots, PinPad } from "../../components/pin-pad";
import { useRecharge } from "../../components/recharge-context";
import { Card, Page, PageHeading } from "../../components/ui";
import { providerInitials } from "../../data/dth";
import { prepaidPlans } from "../../data/prepaid-plans";

const PIN_LENGTH = 4;

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

function DetailRow({
  label,
  value,
  last = false,
  service,
}: {
  label: string;
  value: string;
  last?: boolean;
  service?: string;
}) {
  return (
    <View
      className={`flex-row items-start justify-between gap-4 py-3.5 ${
        last || service === "google-play" ? "" : "border-b border-gray-300"
      }`}
    >
      <Text className="flex-1 text-[13px] text-muted">{label}</Text>
      <Text className="max-w-[62%] text-right text-[13px] font-semibold text-ink">
        {value}
      </Text>
    </View>
  );
}

export default function ConfirmRechargeScreen() {
  const router = useRouter();
  const { balance, submitRecharge } = useRecharge();
  const [busy, setBusy] = useState(false);
  const [requestKey] = useState(newRequestKey);
  const params = useLocalSearchParams<{
    service?: string;
    phone?: string;
    operator?: string;
    operatorName?: string;
    circle?: string;
    amount?: string;
    planId?: string;
    planData?: string;
    planValidity?: string;
    subscriber?: string;
    email?: string;
    customerName?: string;
    planName?: string;
  }>();

  const service =
    params.service === "dth" || params.service === "google-play"
      ? params.service
      : "prepaid";
  const phone = typeof params.phone === "string" ? params.phone : "";
  const subscriber =
    typeof params.subscriber === "string" ? params.subscriber : "";
  const operatorId = service === "google-play" ? "google-play" : (typeof params.operator === "string" ? params.operator : "jio").toLowerCase();
  const operatorName =
    typeof params.operatorName === "string"
      ? params.operatorName
      : service === "dth"
        ? "DTH"
        : "Jio";
  const circle =
    typeof params.circle === "string" ? params.circle : "West Bengal";
  const amount = Number(
    typeof params.amount === "string" ? params.amount : "0",
  );
  const planId = typeof params.planId === "string" ? params.planId : "";
  const customerName =
    typeof params.customerName === "string" ? params.customerName : "";
  const planName = typeof params.planName === "string" ? params.planName : "";

  const plan = useMemo(
    () => prepaidPlans.find((item) => item.id === planId) || (params.planData ? {data:params.planData,validity:params.planValidity || ""} : undefined),
    [planId,params.planData,params.planValidity],
  );

  const operatorLogo = operatorLogos[operatorId] ?? operatorLogos.jio;
  const serviceTitle =
    service === "prepaid"
      ? `${operatorName} prepaid`
      : service === "dth"
        ? operatorName
        : "Recharge code";
  const serviceSubtitle =
    service === "prepaid"
      ? `${phone}`
      : service === "dth"
        ? subscriber
        : "Google Play Redeem";
  const serviceIcon =
    service === "dth"
      ? (dthLogos[operatorId] ?? null)
      : service === "google-play"
        ? require("../../assets/company-logos/google-play.png")
        : operatorLogo;
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  function appendDigit(digit: string) {
    if (pin.length >= PIN_LENGTH) return;
    setPinError("");
    setPin((current) => `${current}${digit}`);
  }

  function removeDigit() {
    setPinError("");
    setPin((current) => current.slice(0, -1));
  }

  async function completeRecharge() {
    if (busy) return;
    if (pin.length < PIN_LENGTH) {
      setPinError(`Enter your ${PIN_LENGTH}-digit NPay M-PIN.`);
      return;
    }

    if (!Number.isFinite(amount) || amount < 1) {
      setPinError("Invalid recharge amount.");
      return;
    }

    if (amount > balance) {
      setPinError("Wallet balance is too low for this recharge.");
      return;
    }

    setBusy(true);setPinError("");
    try {
      const transaction=await submitRecharge({service,amount:amount.toFixed(2),mpin:pin,operator:operatorId,
        ...(service==="prepaid"?{circle,...(/^[0-9a-f-]{36}$/i.test(planId)?{plan_id:planId}:{plan_code:planId}),recipient:phone}:service==="dth"?{recipient:subscriber}:{})},requestKey);
      router.replace({pathname:"/recharge/status",params:{transactionId:transaction.id,service,phone,operator:operatorId,operatorName,circle,amount:String(amount),planId,subscriber,customerName,planName}});
    }catch(error){setPinError(errorMessage(error));}finally{setBusy(false);}
  }

  return (
    <Page scroll={false}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 16, paddingBottom: 12 }}
        >
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
            eyebrow={serviceTitle}
            title={serviceSubtitle}
            subtitle="Confirm the details, then enter your NPay M-PIN."
          />

          <Card className="gap-0 p-4">
            <View className="mb-2 flex-row items-center gap-3.5">
              <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white">
                {serviceIcon ? (
                  <Image
                    accessibilityLabel={`${serviceTitle} logo`}
                    source={serviceIcon}
                    style={{ width: 34, height: 34, resizeMode: "contain" }}
                  />
                ) : (
                  <Text className="text-sm font-extrabold text-green">
                    {providerInitials(operatorName)}
                  </Text>
                )}
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
                  Paying
                </Text>
                <Text className="text-[28px] font-extrabold tracking-[-0.7px] text-ink">
                  ₹{amount.toLocaleString("en-IN")}
                </Text>
              </View>
              <View className="rounded-full bg-green-light px-3 py-1.5">
                <Text className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-green">
                  {service === "google-play"
                    ? "Gift code"
                    : service.toUpperCase()}
                </Text>
              </View>
            </View>
            {service !== "google-play" && (
              <DetailRow
                label={
                  service === "prepaid" ? "Mobile number" : "Consumer number"
                }
                value={serviceSubtitle}
              />
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
                  last
                />
              </>
            ) : null}
            {service === "dth" ? (
              <>
                <DetailRow label="Provider" value={operatorName} />
                {customerName ? (
                  <DetailRow label="Customer" value={customerName} />
                ) : null}
                <DetailRow
                  label="Monthly plan"
                  value={planName || `₹${amount.toLocaleString("en-IN")}`}
                  last
                />
              </>
            ) : null}
          </Card>
        </ScrollView>

        <View className="gap-3 pt-2">
          <View className="gap-3 rounded-xl border border-gray-300 bg-white px-4 py-6">
            <PinDots
              length={PIN_LENGTH}
              filled={pin.length}
              error={Boolean(pinError)}
            />
            {pinError ? (
              <Text className="text-center text-[13px] leading-5 text-danger">
                {pinError}
              </Text>
            ) : null}
          </View>
          {busy ? <Text className="text-center text-sm text-muted">Processing your request…</Text> : null}
          <PinPad
            onDigit={appendDigit}
            onBackspace={removeDigit}
            onDone={completeRecharge}
            doneDisabled={busy || pin.length < PIN_LENGTH}
          />
          <Text className="text-center text-[11px] leading-4.5 text-muted">
            By using this, you agree to NPay&apos;s Terms &amp; Conditions and
            Privacy Policy.
          </Text>
        </View>
      </View>
    </Page>
  );
}
