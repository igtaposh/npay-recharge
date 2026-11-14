import { useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

export function usePaymentSound() {
  const player = useAudioPlayer(
    require("../assets/sounds/payment-success.mp3"),
  );
  // const player = useAudioPlayer(null);

  const playSuccessSound = useCallback(() => {
    player.seekTo(0);
    player.play();
  }, [player]);

  return { playSuccessSound };
}
