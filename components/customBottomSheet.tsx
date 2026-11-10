import type { ReactNode } from "react";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  backgroundColor?: string;
}

export default function CustomBottomSheet({
  visible,
  onClose,
  children,
  title,
  snapPoints: points = ["70%", "85%"],
  enablePanDownToClose = true,
  backgroundColor = "#f5f7fb",
}: CustomBottomSheetProps) {
  const snapPoints = useMemo(() => points, [points]);

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <BottomSheet
        index={visible ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{
          width: 40,
          height: 5,
          backgroundColor: "#D1D5DB",
        }}
        onClose={onClose}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {title && (
            <View
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#EEEEEE",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 19, fontWeight: "700", color: "#111827" }}
              >
                {title}
              </Text>
            </View>
          )}

          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
