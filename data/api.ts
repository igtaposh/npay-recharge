import Constants from "expo-constants";
import { Platform } from "react-native";
import { createApiClient } from "./api-client";

const host = Constants.expoConfig?.hostUri?.split(":")[0];
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__
    ? `http://${host || (Platform.OS === "android" ? "10.0.2.2" : "localhost")}:3000/api/retailer`
    : "");
const key = "npay.refresh-token";
export const api = createApiClient(API_URL, {
  read: async () => {
    if (Platform.OS === "web")
      return typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(key);
    const storage = await import("expo-secure-store");
    return storage.getItemAsync(key);
  },
  write: async (value) => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        if (value) window.sessionStorage.setItem(key, value);
        else window.sessionStorage.removeItem(key);
      }
      return;
    }
    const storage = await import("expo-secure-store");
    if (value) await storage.setItemAsync(key, value);
    else await storage.deleteItemAsync(key);
  },
});
export const newRequestKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
