import CustomBottomSheet from "@/components/customBottomSheet";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from "react-native";
import ContactPicker from "../../components/contactPicker";
import { Button, Card, Page, PageHeading } from "../../components/ui";

type Operator = {
  id: string;
  name: string;
  logo: ImageSourcePropType;
};

const operators: Operator[] = [
  {
    id: "jio",
    name: "Jio",
    logo: require("../../assets/company-logos/jio.png"),
  },
  {
    id: "airtel",
    name: "Airtel",
    logo: require("../../assets/company-logos/airtel.png"),
  },
  {
    id: "vi",
    name: "Vi",
    logo: require("../../assets/company-logos/vi.png"),
  },
  {
    id: "bsnl",
    name: "BSNL",
    logo: require("../../assets/company-logos/bsnl.png"),
  },
];

const circles = [
  "Andhra Pradesh",
  "Assam",
  "Bihar & Jharkhand",
  "Chennai",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Kolkata",
  "Madhya Pradesh & Chhattisgarh",
  "Maharashtra & Goa",
  "Mumbai",
  "North East",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh East",
  "Uttar Pradesh West",
  "West Bengal",
] as const;

export default function PrepaidScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    operator?: string;
    operatorName?: string;
    circle?: string;
    amount?: string;
    planId?: string;
  }>();

  const paramPhone = typeof params.phone === "string" ? params.phone : "";
  const paramAmount = typeof params.amount === "string" ? params.amount : "";
  const paramCircle =
    typeof params.circle === "string" ? params.circle : "West Bengal";
  const paramOperatorId =
    typeof params.operator === "string" ? params.operator : operators[0].id;

  const initialOperator = useMemo(
    () => operators.find((item) => item.id === paramOperatorId) ?? operators[0],
    [paramOperatorId],
  );

  const [phone, setPhone] = useState(paramPhone);
  const [selectedOperator, setSelectedOperator] = useState(initialOperator);
  const [selectedCircle, setSelectedCircle] = useState(paramCircle);
  const [circleSelectorOpen, setCircleSelectorOpen] = useState(false);
  const [circleQuery, setCircleQuery] = useState("");

  const [error, setError] = useState({
    name: "",
    msg: "",
  });
  const [focusAmount, setFocusAmount] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Remount-friendly sync when returning from plans with replace params.
  const appliedReturnKey = `${paramPhone}|${paramAmount}|${paramCircle}|${paramOperatorId}|${params.planId ?? ""}`;
  const [lastAppliedReturnKey, setLastAppliedReturnKey] =
    useState(appliedReturnKey);
  if (appliedReturnKey !== lastAppliedReturnKey) {
    setLastAppliedReturnKey(appliedReturnKey);
    if (paramPhone) setPhone(paramPhone);
    if (paramAmount) {
    }
    setSelectedCircle(paramCircle);
    setSelectedOperator(initialOperator);
  }
  const selectContactPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const nationalNumber =
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith("0")
          ? digits.slice(1)
          : digits;

    if (!/^\d{10}$/.test(nationalNumber)) {
      Alert.alert(
        "Invalid mobile number",
        "Choose a contact with a 10-digit Indian mobile number.",
      );
      return;
    }

    setPhone(nationalNumber);
    setError({
      name: "",
      msg: "",
    });
  };

  const fetchOperatorDetail = () => {
    if (!phone) {
      setError({
        name: "phone",
        msg: "Enter a valid phone number.",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError({
        name: "phone",
        msg: "Enter a valid 10-digit mobile number.",
      });
      return;
    }
    setError({
      name: "",
      msg: "",
    });
  };

  const openPlans = () => {
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError({
        name: "phone",
        msg: "Enter a valid 10-digit mobile number.",
      });
      return;
    }

    setError({ name: "", msg: "" });
    router.push({
      pathname: "/recharge/plans",
      params: {
        phone: phone.trim(),
        operator: selectedOperator.id,
        operatorName: selectedOperator.name,
        circle: selectedCircle,
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
        eyebrow="MOBILE RECHARGE"
        title="Prepaid"
        subtitle="Top up your number in just a few taps."
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Selected operator: ${selectedOperator.name} Prepaid, ${selectedCircle} circle. Tap to change.`}
        onPress={() => {
          setCircleSelectorOpen(false);
          setCircleQuery("");
          setSheetVisible(true);
        }}
      >
        <Card className="flex-row items-center gap-3.5 p-4">
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white">
            <Image
              accessibilityLabel={`${selectedOperator.name} logo`}
              source={selectedOperator.logo}
              style={{ width: 34, height: 34, resizeMode: "contain" }}
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[10px] font-bold uppercase tracking-[1px] text-muted">
              Selected operator
            </Text>
            <Text className="text-base font-extrabold text-ink">
              {selectedOperator.name} Prepaid
            </Text>
            <Text className="text-xs font-medium text-muted">
              {selectedCircle} circle
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={22} color="#68788F" />
        </Card>
      </Pressable>

      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-ink">Mobile number</Text>
          <Text className="text-xs font-medium text-muted">10 digits</Text>
        </View>
        <View className="min-h-17 flex-row items-center gap-3 rounded-xl border border-gray-300 bg-white px-2">
          <View className="p-2">
            <Text className="text-xl font-bold ml-1">+91</Text>
          </View>
          <View className="h-12 w-px bg-gray-300" />
          <TextInput
            accessibilityLabel="10-digit mobile number"
            className="min-h-17 flex-1 p-0 pl-2 text-xl tracking-[1px] text-ink"
            value={phone}
            onChangeText={(value) => {
              setPhone(value.replace(/\D/g, "").slice(0, 10));
            }}
            placeholder="Enter mobile number"
            placeholderTextColor="#8A98AB"
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="next"
            onBlur={fetchOperatorDetail}
          />
          <ContactPicker onSelect={selectContactPhone} />
        </View>
      </View>
      {error.name === "phone" ? (
        <Text className="text-[13px] leading-5 text-danger">{error.msg}</Text>
      ) : null}

      <Button
        disabled={phone === ""}
        label={"View Plans"}
        onPress={openPlans}
      />
      <Text className="text-center text-[11px] leading-4.5 text-muted">
        By using this, you agree to NPay&apos;s Terms &amp; Conditions and
        Privacy Policy.
      </Text>
      {sheetVisible && (
        <CustomBottomSheet
          visible
          onClose={() => {
            setSheetVisible(false);
            setCircleSelectorOpen(false);
            setCircleQuery("");
          }}
          title="Select your operator"
          snapPoints={["72%", "90%"]}
        >
          <View className="gap-4 px-1 pb-2">
            <View className="gap-1">
              <Text className="text-sm leading-5 text-muted">
                Choose your circle and mobile operator.
              </Text>
            </View>

            <View className="gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Recharge circle: ${selectedCircle}`}
                accessibilityState={{ expanded: circleSelectorOpen }}
                onPress={() => setCircleSelectorOpen((open) => !open)}
                className="min-h-17 flex-row items-center gap-5 rounded-xl border border-gray-300 bg-white px-3.5 py-3"
              >
                <View className="h-14 w-14 items-center justify-center rounded-xl bg-green-light">
                  <MaterialIcons name="place" size={30} color="#168A73" />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-muted">
                    Selected circle
                  </Text>
                  <Text className="text-md font-bold text-ink">
                    {selectedCircle}
                  </Text>
                </View>
                <View className="rounded-full bg-[#F1F5FB] px-3 py-1.5">
                  <Text className="text-sm font-bold text-green">Change</Text>
                </View>
                <MaterialIcons
                  name={
                    circleSelectorOpen
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={22}
                  color="#68788F"
                />
              </Pressable>

              {circleSelectorOpen ? (
                <View className="gap-3 rounded-xl border border-gray-300 bg-white p-3">
                  <View className="min-h-16 flex-row items-center gap-2 rounded-xl border border-gray-300 px-3">
                    <MaterialIcons name="search" size={25} color="#68788F" />
                    <TextInput
                      accessibilityLabel="Search recharge circles"
                      value={circleQuery}
                      onChangeText={setCircleQuery}
                      placeholder="Search circles"
                      placeholderTextColor="#8A98AB"
                      className="min-h-16 flex-1 p-0 text-sm text-ink"
                      autoCapitalize="words"
                      returnKeyType="search"
                    />
                  </View>

                  <View className="gap-2">
                    {circles
                      .filter((circle) =>
                        circle
                          .toLowerCase()
                          .includes(circleQuery.trim().toLowerCase()),
                      )
                      .map((circle) => {
                        const isSelected = selectedCircle === circle;

                        return (
                          <Pressable
                            key={circle}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                            onPress={() => {
                              setSelectedCircle(circle);
                              setCircleSelectorOpen(false);
                              setCircleQuery("");
                            }}
                            className={`min-h-12.5 flex-row items-center justify-between rounded-xl border px-3.5 ${
                              isSelected
                                ? "border-green bg-green-light"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <Text
                              className={`flex-1 text-sm font-semibold ${
                                isSelected ? "text-green" : "text-ink"
                              }`}
                            >
                              {circle}
                            </Text>
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

                  {circles.every(
                    (circle) =>
                      !circle
                        .toLowerCase()
                        .includes(circleQuery.trim().toLowerCase()),
                  ) ? (
                    <Text className="px-1 py-2 text-md text-muted">
                      No circles match &quot;{circleQuery.trim()}&quot;.
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View className="gap-2.5">
              {operators.map((operator) => {
                const isSelected = selectedOperator.id === operator.id;

                return (
                  <Pressable
                    key={operator.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${operator.name} prepaid operator`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setSelectedOperator(operator);
                      setSheetVisible(false);
                      setCircleSelectorOpen(false);
                      setCircleQuery("");
                    }}
                    className={`min-h-19 flex-row items-center gap-3 rounded-xl border px-3.5 py-3 ${
                      isSelected
                        ? "border-green bg-green-light"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white">
                      <Image
                        accessibilityLabel={`${operator.name} logo`}
                        source={operator.logo}
                        style={{ width: 34, height: 34, resizeMode: "contain" }}
                      />
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-[15px] font-extrabold text-ink">
                        {operator.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {operator.name} Prepaid
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

            <View className="rounded-xl border border-line bg-white px-3.5 py-3">
              <Text className="text-xs leading-5 text-muted">
                Your selected operator will be used to find available recharge
                plans.
              </Text>
            </View>
          </View>
        </CustomBottomSheet>
      )}
    </Page>
  );
}
