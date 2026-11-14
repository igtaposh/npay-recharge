import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useState } from "react";
import {
  Animated as NativeAnimated,
  Pressable,
  Text,
  View,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";

type PinPadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "backspace"
  | "done";

const rows: PinPadKey[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["backspace", "0", "done"],
];

function PadKey({
  value,
  disabled = false,
  onPress,
}: {
  value: PinPadKey;
  disabled?: boolean;
  onPress: (value: PinPadKey) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [pressScale] = useState(() => new NativeAnimated.Value(1));
  const isDone = value === "done";
  const isBackspace = value === "backspace";

  return (
    <NativeAnimated.View
      className="flex-1"
      style={{ transform: [{ scale: pressScale }] }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isDone ? "Done" : isBackspace ? "Backspace" : `Digit ${value}`
        }
        disabled={disabled}
        onPress={() => onPress(value)}
        onPressIn={() => {
          if (!reduceMotion && !disabled) {
            NativeAnimated.spring(pressScale, {
              toValue: 0.96,
              speed: 45,
              bounciness: 0,
              useNativeDriver: true,
            }).start();
          }
        }}
        onPressOut={() => {
          NativeAnimated.spring(pressScale, {
            toValue: 1,
            speed: 45,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }}
        className={`min-h-19 items-center justify-center rounded-xl border ${
          isDone
            ? "border-green bg-green"
            : isBackspace
              ? "border-line bg-green-light"
              : "border-gray-300 bg-white"
        } ${disabled ? "opacity-45" : ""}`}
      >
        {isBackspace ? (
          <MaterialIcons name="backspace" size={24} color="#0550DD" />
        ) : (
          <Text
            className={`text-3xl font-medium tracking-[-0.4px] ${
              isDone ? "text-white" : "text-ink"
            }`}
          >
            {isDone ? "Done" : value}
          </Text>
        )}
      </Pressable>
    </NativeAnimated.View>
  );
}

export function PinPad({
  onDigit,
  onBackspace,
  onDone,
  doneDisabled = false,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onDone: () => void;
  doneDisabled?: boolean;
}) {
  function handlePress(value: PinPadKey) {
    if (value === "done") {
      onDone();
      return;
    }
    if (value === "backspace") {
      onBackspace();
      return;
    }
    onDigit(value);
  }

  return (
    <View className="gap-2.5 rounded-xl border border-gray-300 bg-white p-3">
      {rows.map((row) => (
        <View key={row.join("-")} className="flex-row gap-2.5">
          {row.map((key) => (
            <PadKey
              key={key}
              value={key}
              disabled={key === "done" ? doneDisabled : false}
              onPress={handlePress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function PinDots({
  length,
  filled,
  error = false,
}: {
  length: number;
  filled: number;
  error?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-center gap-3">
      {Array.from({ length }).map((_, index) => {
        const isFilled = index < filled;
        return (
          <View
            key={`pin-dot-${index}`}
            className={`h-8 w-8 rounded-full border ${
              error
                ? "border-danger bg-danger"
                : isFilled
                  ? "border-green bg-green"
                  : "border-gray-300"
            }`}
          />
        );
      })}
    </View>
  );
}
