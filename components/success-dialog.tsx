import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { Modal, Pressable, Text, View } from "react-native";

export function SuccessDialog({
  visible,
  title,
  message,
  buttonLabel = "Continue",
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-[#07192F]/30 px-6"
        onPress={onClose}
      >
        <Pressable className="w-full max-w-[360px] overflow-hidden rounded-[30px] border border-white/80 bg-white p-6 shadow-[0_20px_60px_rgba(7,25,47,0.22)]">
          <View className="mb-5 h-16 w-16 items-center justify-center self-center rounded-full bg-[#EAF7F2]">
            <MaterialIcons name="check" size={30} color="#168A73" />
          </View>

          <Text className="text-center text-[24px] font-extrabold tracking-[-0.5px] text-ink">
            {title}
          </Text>
          <Text className="mt-2 text-center text-[15px] leading-6 text-muted">
            {message}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="mt-6 min-h-[52px] items-center justify-center rounded-[16px] bg-green"
          >
            <Text className="text-base font-bold text-white">{buttonLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
