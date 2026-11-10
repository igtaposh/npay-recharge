import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const inset = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#0550dd",
        tabBarStyle: [
          {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
            height: inset.bottom + 68,
            borderTopWidth: 1,
            borderTopColor: "#E8EDF4",
            shadowColor: "#10213A",
            shadowOpacity: 0.07,
            shadowRadius: 12,
            backgroundColor: "#fff",
            shadowOffset: { width: 0, height: -4 },
            elevation: 9,
          },
        ],
        tabBarItemStyle: {
          paddingTop: 4,
          borderRadius: 16,
          minHeight: 52,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 1,
          textTransform: "capitalize",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Recharges",
          tabBarIcon: () => (
            <View className="flex-row items-center gap-1">
              <View className="h-[21px] w-[19px] items-center justify-center rounded-[5px] bg-[#0550DD]">
                <Text className="text-[17px] font-extrabold leading-[20px] text-white">
                  n
                </Text>
              </View>
              <Text className="text-[18px] font-extrabold tracking-[-0.7px] text-black">
                pay
              </Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={focused ? 22 : 20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={focused ? 23 : 21}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "help-circle" : "help-circle-outline"}
              size={focused ? 24.5 : 22.5}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
