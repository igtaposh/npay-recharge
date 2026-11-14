import Ionicons from "@react-native-vector-icons/ionicons/static";
import { useState } from "react";
import { Alert, Platform, Pressable } from "react-native";

interface Props {
  onSelect: (phone: string) => void;
}

export default function ContactPicker({ onSelect }: Props) {
  const [loading, setLoading] = useState(false);

  if (Platform.OS === "web") return null;

  const pickContact = async () => {
    try {
      setLoading(true);
      const { Contact, requestPermissionsAsync } =
        await import("expo-contacts");
      const permission = await requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Contacts permission required",
          "Allow contacts access to choose a mobile number.",
        );
        return;
      }

      const contact = await Contact.presentPicker();
      if (!contact) return;

      const phones = await contact.getPhones();
      const phoneNumber = phones.find(
        ({ number }) => typeof number === "string" && number.trim().length > 0,
      )?.number;
      if (!phoneNumber) {
        Alert.alert("No phone number", "This contact has no phone number.");
        return;
      }

      onSelect(phoneNumber);
    } catch (error) {
      const missingNativeModule =
        error instanceof Error && error.message.includes("ExpoContactsNext");
      const missingPermission =
        error instanceof Error &&
        /READ_CONTACTS|permission/i.test(error.message);
      console.error("Contact picker failed:", error);
      Alert.alert(
        missingNativeModule
          ? "App update required"
          : missingPermission
            ? "Contacts permission required"
            : "Unable to select contact",
        missingNativeModule
          ? "Rebuild the development app to enable contact selection."
          : missingPermission
            ? "Allow contacts access in your device settings, then try again."
            : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Choose a mobile number from contacts"
      accessibilityHint="Opens your contacts to select a mobile number"
      accessibilityState={{ disabled: loading }}
      className="h-11 w-11 items-center justify-center rounded-full pr-2 active:opacity-70"
      onPress={pickContact}
      disabled={loading}
    >
      <Ionicons name="person-outline" size={22} />
    </Pressable>
  );
}
