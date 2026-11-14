import CustomBottomSheet from "@/components/customBottomSheet";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useRecharge } from "../../components/recharge-context";
import { Button, Card, Page, PageHeading } from "../../components/ui";
import {
  dthProviders,
  lookupDthCustomer,
  providerInitials,
  type DthCustomer,
  type DthProviderId,
} from "../../data/dth";

const providerLogos: Partial<Record<DthProviderId, ImageSourcePropType>> = {
  "airtel-dth": require("../../assets/company-logos/airtel-digital-tv.png"),
  dishtv: require("../../assets/company-logos/dishtv.png"),
};

const providers = dthProviders.map((provider) => ({
  ...provider,
  logo: providerLogos[provider.id],
}));

type Provider = (typeof providers)[number];

function ProviderMark({
  provider,
  size = 34,
}: {
  provider: Provider;
  size?: number;
}) {
  if (provider.logo) {
    return (
      <Image
        accessibilityLabel={`${provider.name} logo`}
        source={provider.logo}
        style={{ width: size, height: size, resizeMode: "contain" }}
      />
    );
  }

  return (
    <Text className="text-sm font-extrabold text-green">
      {providerInitials(provider.name)}
    </Text>
  );
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

export default function DthScreen() {
  const router = useRouter();
  const { balance } = useRecharge();
  const params = useLocalSearchParams<{
    subscriber?: string;
    operator?: string;
  }>();

  const paramSubscriber =
    typeof params.subscriber === "string" ? params.subscriber : "";
  const paramOperatorId =
    typeof params.operator === "string" ? params.operator : providers[0].id;

  const initialProvider = useMemo(
    () =>
      providers.find((item) => item.id === paramOperatorId) ?? providers[0],
    [paramOperatorId],
  );

  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [consumer, setConsumer] = useState(
    paramSubscriber.replace(/\D/g, "").slice(0, initialProvider.digits),
  );
  const [customer, setCustomer] = useState<DthCustomer | null>(null);
  const [amount, setAmount] = useState("");
  const [fetching, setFetching] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [error, setError] = useState({ name: "", msg: "" });

  const requestId = useRef(0);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appliedKey = `${paramSubscriber}|${paramOperatorId}`;
  const [lastAppliedKey, setLastAppliedKey] = useState(appliedKey);
  if (appliedKey !== lastAppliedKey) {
    requestId.current += 1;
    setLastAppliedKey(appliedKey);
    setFetching(false);
    setSelectedProvider(initialProvider);
    setCustomer(null);
    setAmount("");
    if (paramSubscriber) {
      setConsumer(
        paramSubscriber.replace(/\D/g, "").slice(0, initialProvider.digits),
      );
    }
    setError({ name: "", msg: "" });
  }

  useEffect(() => {
    return () => {
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
    };
  }, []);

  const suggestions = customer
    ? [
        { label: "Due", value: customer.dueAmount },
        { label: "3 months", value: customer.plan.amount * 3 },
        { label: "6 months", value: customer.plan.amount * 6 },
        { label: "12 months", value: customer.plan.amount * 12 },
      ]
    : [];

  const selectProvider = (provider: Provider) => {
    requestId.current += 1;
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    setFetching(false);
    setSelectedProvider(provider);
    setConsumer((current) => current.slice(0, provider.digits));
    setCustomer(null);
    setAmount("");
    setError({ name: "", msg: "" });
    setSheetVisible(false);
  };

  const clearCustomer = () => {
    requestId.current += 1;
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    setFetching(false);
    setCustomer(null);
    setAmount("");
    setError({ name: "", msg: "" });
  };

  const fetchDetails = () => {
    if (!new RegExp(`^\\d{${selectedProvider.digits}}$`).test(consumer)) {
      setError({
        name: "consumer",
        msg: `Enter the ${selectedProvider.digits}-digit ${selectedProvider.numberName}.`,
      });
      return;
    }

    setError({ name: "", msg: "" });
    setFetching(true);
    const current = ++requestId.current;
    const providerId = selectedProvider.id;
    const consumerNumber = consumer;

    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      if (requestId.current !== current) return;
      const nextCustomer = lookupDthCustomer(providerId, consumerNumber);
      setCustomer(nextCustomer);
      setAmount(String(nextCustomer.dueAmount));
      setFetching(false);
    }, 500);
  };

  const proceed = () => {
    if (!customer) return;

    const value = Number(amount);
    if (!Number.isInteger(value) || value < 1) {
      setError({
        name: "amount",
        msg: "Enter a recharge amount.",
      });
      return;
    }
    if (value > 25000) {
      setError({
        name: "amount",
        msg: "Amount cannot be more than ₹25,000.",
      });
      return;
    }
    if (value > balance) {
      setError({
        name: "amount",
        msg: "Your wallet balance is too low. Add balance to continue.",
      });
      return;
    }

    setError({ name: "", msg: "" });
    router.push({
      pathname: "/recharge/confirm",
      params: {
        service: "dth",
        subscriber: customer.consumerNumber,
        amount: String(value),
        operator: selectedProvider.id,
        operatorName: selectedProvider.name,
        customerName: customer.name,
        planName: `${customer.plan.name} · ${customer.plan.validity}`,
      },
    });
  };

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
        eyebrow="TELEVISION"
        title="DTH recharge"
        subtitle="Fetch your connection, then pay the due."
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Selected provider: ${selectedProvider.name}. Tap to change.`}
        onPress={() => setSheetVisible(true)}
      >
        <Card className="flex-row items-center gap-3.5 p-4">
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white">
            <ProviderMark provider={selectedProvider} />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
              Selected provider
            </Text>
            <Text className="text-base font-extrabold text-ink">
              {selectedProvider.name}
            </Text>
            <Text className="text-xs font-medium text-muted">
              {selectedProvider.digits}-digit {selectedProvider.numberName}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={22} color="#68788F" />
        </Card>
      </Pressable>

      {customer ? (
        <Card className="gap-0 p-4">
          <View className="mb-1 flex-row items-center gap-3.5">
            <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white">
              <ProviderMark provider={selectedProvider} />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
                Consumer
              </Text>
              <Text className="text-base font-extrabold text-ink">
                {customer.name}
              </Text>
              <Text className="text-xs font-medium text-muted">
                {customer.consumerNumber}
              </Text>
            </View>
            <View className="items-end gap-2">
              <View
                className={`rounded-full px-3 py-1.5 ${
                  customer.status === "Active" ? "bg-green-light" : "bg-[#FFF2DE]"
                }`}
              >
                <Text
                  className={`text-[10px] font-extrabold uppercase tracking-[0.6px] ${
                    customer.status === "Active"
                      ? "text-green"
                      : "text-[#C47716]"
                  }`}
                >
                  {customer.status}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change consumer number"
                onPress={clearCustomer}
              >
                <Text className="text-xs font-bold text-green">Change</Text>
              </Pressable>
            </View>
          </View>
          <DetailRow label="Monthly plan" value={customer.plan.name} />
          <DetailRow label="Channels" value={customer.plan.channels} />
          <DetailRow
            label="Plan price"
            value={`₹${customer.plan.amount.toLocaleString("en-IN")} · ${customer.plan.validity}`}
          />
          <DetailRow
            label="Due date"
            value={customer.dueDate}
            last
          />
          {customer.status === "Inactive" ? (
            <Text className="pt-3 text-[13px] leading-5 text-[#C47716]">
              This connection is inactive. Recharge to resume channels.
            </Text>
          ) : null}
        </Card>
      ) : null}

      {customer ? (
        <View className="gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-ink">Recharge amount</Text>
            <Text className="text-xs font-medium text-muted">
              Due ₹{customer.dueAmount.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="min-h-17 flex-row items-center gap-3 rounded-xl border border-gray-300 bg-white px-2">
            <View className="p-2">
              <Text className="ml-1 text-xl font-bold text-ink">₹</Text>
            </View>
            <View className="h-12 w-px bg-gray-300" />
            <TextInput
              accessibilityLabel="Recharge amount"
              className="min-h-17 flex-1 p-0 pl-2 text-xl tracking-[1px] text-ink"
              value={amount}
              onChangeText={(value) => {
                setAmount(value.replace(/\D/g, "").slice(0, 5));
                setError({ name: "", msg: "" });
              }}
              placeholder="Enter amount"
              placeholderTextColor="#8A98AB"
              keyboardType="number-pad"
              maxLength={5}
              returnKeyType="done"
              onSubmitEditing={proceed}
            />
          </View>
          <View className="flex-row flex-wrap gap-2">
            {suggestions.map((option) => {
              const isSelected = Number(amount) === option.value;
              return (
                <Pressable
                  key={option.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setAmount(String(option.value));
                    setError({ name: "", msg: "" });
                  }}
                  className={`rounded-xl border px-3.5 py-2.5 ${
                    isSelected
                      ? "border-green bg-green-light"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? "text-green" : "text-ink"
                    }`}
                  >
                    {option.label} · ₹{option.value.toLocaleString("en-IN")}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <View className="gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-ink">Consumer number</Text>
            <Text className="text-xs font-medium text-muted">
              {selectedProvider.digits} digits
            </Text>
          </View>
          <View className="min-h-17 flex-row items-center gap-3 rounded-xl border border-gray-300 bg-white px-2">
            <View className="h-11 w-11 items-center justify-center">
              <MaterialIcons name="live-tv" size={22} color="#68788F" />
            </View>
            <View className="h-12 w-px bg-gray-300" />
            <TextInput
              accessibilityLabel={`${selectedProvider.name} consumer number`}
              className="min-h-17 flex-1 p-0 pl-2 text-xl tracking-[1px] text-ink"
              value={consumer}
              onChangeText={(value) => {
                setConsumer(
                  value.replace(/\D/g, "").slice(0, selectedProvider.digits),
                );
                setError({ name: "", msg: "" });
              }}
              placeholder={`Enter ${selectedProvider.numberName}`}
              placeholderTextColor="#8A98AB"
              keyboardType="number-pad"
              maxLength={selectedProvider.digits}
              editable={!fetching}
              returnKeyType="search"
              onSubmitEditing={fetchDetails}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Use sample consumer number ${selectedProvider.sampleNumber}`}
            onPress={() => {
              setConsumer(selectedProvider.sampleNumber);
              setError({ name: "", msg: "" });
            }}
          >
            <Text className="text-xs leading-5 text-muted">
              {selectedProvider.name} {selectedProvider.numberName}.{" "}
              <Text className="font-bold text-green">
                Use sample {selectedProvider.sampleNumber}
              </Text>
            </Text>
          </Pressable>
        </View>
      )}

      {error.msg ? (
        <Text className="text-[13px] leading-5 text-danger">{error.msg}</Text>
      ) : null}

      <Button
        disabled={customer ? amount === "" : consumer === "" || fetching}
        label={
          customer
            ? amount
              ? `Proceed · ₹${Number(amount).toLocaleString("en-IN")}`
              : "Enter an amount"
            : fetching
              ? "Fetching details…"
              : "Fetch details"
        }
        onPress={customer ? proceed : fetchDetails}
      />
      <Text className="text-center text-[11px] leading-4.5 text-muted">
        By using this, you agree to NPay&apos;s Terms &amp; Conditions and
        Privacy Policy.
      </Text>

      {sheetVisible ? (
        <CustomBottomSheet
          visible
          onClose={() => setSheetVisible(false)}
          title="Select your DTH provider"
          snapPoints={["58%", "85%"]}
        >
          <View className="gap-4 px-1 pb-2">
            <Text className="text-sm leading-5 text-muted">
              Choose the operator on your set-top box.
            </Text>
            <View className="gap-2.5">
              {providers.map((provider) => {
                const isSelected = selectedProvider.id === provider.id;

                return (
                  <Pressable
                    key={provider.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${provider.name} DTH provider`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => selectProvider(provider)}
                    className={`min-h-19 flex-row items-center gap-3 rounded-xl border px-3.5 py-3 ${
                      isSelected
                        ? "border-green bg-green-light"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white">
                      <ProviderMark provider={provider} />
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-[15px] font-extrabold text-ink">
                        {provider.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {provider.digits}-digit {provider.numberName}
                      </Text>
                    </View>
                    <View
                      className={`h-5.5 w-5.5 items-center justify-center rounded-full border-[1.5px] ${
                        isSelected ? "border-green" : "border-[#CBD6D3]"
                      }`}
                    >
                      {isSelected ? (
                        <View className="h-3 w-3 rounded-full bg-green" />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </CustomBottomSheet>
      ) : null}
    </Page>
  );
}
