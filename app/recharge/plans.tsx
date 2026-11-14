import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button, Page, PageHeading } from "../../components/ui";
import {
  planCategories,
  prepaidPlans,
  type PlanCategoryId,
  type PrepaidPlan,
} from "../../data/prepaid-plans";

export default function PrepaidPlansScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    operator?: string;
    operatorName?: string;
    circle?: string;
  }>();

  const phone = params.phone ?? "";
  const operatorId = (params.operator ?? "jio").toLowerCase();
  const operatorName = params.operatorName ?? "Jio";
  const circle = params.circle ?? "West Bengal";

  const [category, setCategory] = useState<PlanCategoryId>("popular");
  const [query, setQuery] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return prepaidPlans.filter((plan) => {
      const matchesCategory = plan.category === category;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return (
        String(plan.amount).includes(normalizedQuery) ||
        plan.data.toLowerCase().includes(normalizedQuery) ||
        plan.validity.toLowerCase().includes(normalizedQuery) ||
        plan.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [category, query]);

  const selectedPlan = prepaidPlans.find((plan) => plan.id === selectedPlanId);

  function rechargePlan(plan: PrepaidPlan) {
    router.push({
      pathname: "/recharge/confirm",
      params: {
        phone,
        operator: operatorId,
        operatorName,
        circle,
        amount: String(plan.amount),
        planId: plan.id,
      },
    });
  }

  return (
    <Page scroll={false}>
      <View className="flex-1 gap-4">
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
          eyebrow="RECHARGING FOR"
          title={phone ? `${phone}` : "Mobile number"}
          subtitle={`${operatorName} · ${circle}`}
        />

        <View className="min-h-14 flex-row items-center gap-3 rounded-xl border border-gray-300 bg-white px-3.5">
          <MaterialIcons name="search" size={25} color="#68788F" />
          <TextInput
            accessibilityLabel="Search recharge plans"
            value={query}
            onChangeText={setQuery}
            placeholder="Search by amount or data"
            placeholderTextColor="#8A98AB"
            keyboardType="default"
            className="min-h-14 flex-1 p-0 text-md text-ink"
            returnKeyType="search"
          />
          {query ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setQuery("")}
            >
              <MaterialIcons name="close" size={20} color="#68788F" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingRight: 4,
          }}
          className="shrink-0"
          style={{ height: 40, flexGrow: 0, flexShrink: 0 }}
        >
          {planCategories.map((item) => {
            const isActive = category === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => {
                  setCategory(item.id);
                  setSelectedPlanId(null);
                }}
                className={`h-10 rounded-xl border px-4 py-2.5 ${
                  isActive
                    ? "border-green bg-green-light"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    isActive ? "text-green" : "text-ink"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
        >
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                className={`rounded-xl border bg-white p-4 ${
                  isSelected ? "border-green bg-green-light" : "border-gray-300"
                }`}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-2">
                    <View className="flex-row flex-wrap items-center gap-2">
                      <Text className="text-[22px] font-extrabold tracking-[-0.5px] text-ink">
                        ₹{plan.amount}
                      </Text>
                      {plan.tag ? (
                        <View className="rounded-full bg-green-light px-2.5 py-1">
                          <Text className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-green">
                            {plan.tag}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                      <View className="rounded-full border border-line bg-canvas px-2.5 py-1">
                        <Text className="text-[11px] font-bold text-ink">
                          {plan.data}
                        </Text>
                      </View>
                      <View className="rounded-full border border-line bg-canvas px-2.5 py-1">
                        <Text className="text-[11px] font-bold text-ink">
                          {plan.validity}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-[13px] leading-5 text-muted">
                      {plan.description}
                    </Text>
                  </View>

                  <View
                    className={`mt-1 h-5.5 w-5.5 items-center justify-center rounded-full border-[1.5px] ${
                      isSelected ? "border-green" : "border-[#CBD6D3]"
                    }`}
                  >
                    {isSelected ? (
                      <View className="h-3 w-3 rounded-full bg-green" />
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })}

          {filteredPlans.length === 0 ? (
            <View className="items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-10">
              <MaterialIcons name="search-off" size={28} color="#68788F" />
              <Text className="text-base font-bold text-ink">
                No plans found
              </Text>
              <Text className="text-center text-sm leading-5 text-muted">
                Try another category or clear the search.
              </Text>
            </View>
          ) : null}
        </ScrollView>
        {selectedPlan ? (
          <>
            <Button
              label={`Recharge · ₹${selectedPlan.amount}`}
              onPress={() => rechargePlan(selectedPlan)}
            />
            <Text className="text-center text-[11px] leading-4.5 text-muted">
              By using this, you agree to NPay&apos;s Terms &amp; Conditions and
              Privacy Policy.
            </Text>
          </>
        ) : null}
      </View>
    </Page>
  );
}
