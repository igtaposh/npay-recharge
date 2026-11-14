import { api, errorMessage } from "../data/api";
import type { Challenge } from "../data/api-types";
import CustomBottomSheet from "@/components/customBottomSheet";
import { PinDots, PinPad } from "@/components/pin-pad";
import { useRecharge } from "@/components/recharge-context";
import { SuccessDialog } from "@/components/success-dialog";
import { WalletBalanceBar } from "@/components/wallet-balance-bar";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button, Card, Field, Page, PageHeading } from "../components/ui";
import {
  privacyPolicySections,
  privacyPolicyUpdated,
} from "../data/privacy-policy";

const MPIN_LENGTH = 4;

type MpinStep = "current" | "new" | "confirm" | "password" | "otp";
type MpinFlow = "change" | "reset";
type StepIcon = "lock" | "vpn-key" | "check-circle" | "verified-user" | "sms";

const stepContent: Record<
  MpinStep,
  { title: string; description: string; icon: StepIcon }
> = {
  current: {
    title: "Enter your current M-PIN",
    description: "Confirm it's you before setting a new M-PIN.",
    icon: "lock",
  },
  new: {
    title: "Choose a new M-PIN",
    description: "Pick 4 digits you'll remember. Don't share them with anyone.",
    icon: "vpn-key",
  },
  confirm: {
    title: "Confirm your new M-PIN",
    description: "Enter the same 4 digits again to confirm.",
    icon: "check-circle",
  },
  password: {
    title: "Verify your password",
    description: "Enter your NPay account password to reset your M-PIN.",
    icon: "verified-user",
  },
  otp: {
    title: "Enter the OTP",
    description: "A 6-digit OTP has been sent to your registered mobile number.",
    icon: "sms",
  },
};

function getStepNumber(step: MpinStep, flow: MpinFlow): number {
  if (flow === "reset") {
    if (step === "password") return 1;
    if (step === "otp") return 2;
    if (step === "new") return 3;
    return 4;
  }

  if (step === "current") return 1;
  if (step === "new") return 2;
  return 3;
}

function MpinEntry({
  pin,
  error,
  onDigit,
  onBackspace,
  onDone,
}: {
  pin: string;
  error: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onDone: () => void;
}) {
  return (
    <View className="gap-3">
      <View className="gap-3 rounded-xl border border-gray-300 bg-white px-4 py-6">
        <PinDots
          length={MPIN_LENGTH}
          filled={pin.length}
          error={Boolean(error)}
        />
        {error ? (
          <Text className="text-center text-[13px] leading-5 text-danger">
            {error}
          </Text>
        ) : null}
      </View>
      <PinPad
        onDigit={onDigit}
        onBackspace={onBackspace}
        onDone={onDone}
        doneDisabled={pin.length < MPIN_LENGTH}
      />
    </View>
  );
}

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { account, signOut } = useRecharge();
  const setup = !account?.has_mpin;
  const [currentMpin, setCurrentMpin] = useState("");
  const [busy, setBusy] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [proof, setProof] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [step, setStep] = useState<MpinStep>("current");
  const [flow, setFlow] = useState<MpinFlow>("change");
  const [pin, setPin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    buttonLabel: "Done",
  });

  const content = stepContent[step];
  const stepNumber = getStepNumber(step, flow);
  const totalSteps = flow === "reset" ? 4 : 3;

  function resetSheetState() {
    setStep("current");
    setFlow("change");
    setPin("");
    setNewMpin("");
    setPassword("");
    setOtp("");
    setError("");
  }

  function openSheet() {
    resetSheetState();
    setStep(setup ? "password" : "current");
    setSheetVisible(true);
  }

  function closeSheet() {
    setSheetVisible(false);
    resetSheetState();
  }

  function appendDigit(digit: string) {
    if (pin.length >= MPIN_LENGTH) return;
    setError("");
    setPin((current) => `${current}${digit}`);
  }

  function removeDigit() {
    setError("");
    setPin((current) => current.slice(0, -1));
  }

  async function completeMpinChange() {
    if (busy) return;
    setBusy(true);setError("");
    try {
      if(flow==="reset") await api.request("security/mpin/reset",{verification_token:proof,new_mpin:newMpin});
      else await api.request("security/mpin",{new_mpin:newMpin,...(setup?{current_password:password}:{current_mpin:currentMpin})});
      Alert.alert("M-PIN updated","Please sign in again to continue.");await signOut(false);
    }catch(error){setError(errorMessage(error));}finally{setBusy(false);}
  }

  function submitPin() {
    if (busy) return;
    if (pin.length < MPIN_LENGTH) {
      setError(`Enter your ${MPIN_LENGTH}-digit M-PIN.`);
      return;
    }

    if (step === "current") {
      setCurrentMpin(pin);
      setError("");
      setPin("");
      setStep("new");
      return;
    }

    if (step === "new") {
      setNewMpin(pin);
      setError("");
      setPin("");
      setStep("confirm");
      return;
    }

    if (pin !== newMpin) {
      setError("M-PINs do not match. Enter it again.");
      setPin("");
      return;
    }

    void completeMpinChange();
  }

  function startReset() {
    setFlow("reset");
    setStep("password");
    setPin("");
    setError("");
  }

  function backToMpin() {
    setFlow("change");
    setStep("current");
    setPassword("");
    setOtp("");
    setPin("");
    setError("");
  }

  function backToNewMpin() {
    setStep("new");
    setPin("");
    setError("");
  }

  async function verifyPassword() {
    if(busy)return;setBusy(true);setError("");
    try {
      if(setup && flow!=="reset"){if(password.length<8)throw new Error("Enter your account password.");setStep("new");return;}
      const response=await api.request<Challenge>("security/otp/request",{purpose:"mpin_reset",current_password:password});
      setChallengeId(response.data.challenge_id);setDemoOtp(response.data.demo_otp||"");setStep("otp");
    }catch(error){setError(errorMessage(error));}finally{setBusy(false);}
  }
  async function verifyOtp() {
    if(busy)return;setBusy(true);setError("");
    try {const response=await api.request<{verification_token:string}>("security/otp/verify",{challenge_id:challengeId,otp});setProof(response.data.verification_token);setPin("");setDemoOtp("");setStep("new");}
    catch(error){setError(errorMessage(error));}finally{setBusy(false);}
  }

  return (
    <>
      <Page>
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
          eyebrow="YOUR SAFETY"
          title="Privacy & security"
          subtitle="Your M-PIN, your data, and the controls that keep them safe."
        />

        <Card className="gap-4">
          <View className="flex-row items-center gap-3.5">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-green-light">
              <MaterialIcons name="lock" size={24} color="#0550DD" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-base font-extrabold text-ink">
                NPay M-PIN
              </Text>
              <Text className="text-xs leading-5 text-muted">
                A 4-digit PIN that confirms every recharge.
              </Text>
            </View>
            <View className="rounded-full bg-green-light px-3 py-1.5">
              <Text className="text-[11px] font-extrabold tracking-[1.5px] text-green">
                ••••
              </Text>
            </View>
          </View>
          <Button
            label={setup ? "Set M-PIN" : "Change M-PIN"}
            variant="ghost"
            onPress={openSheet}
          />
        </Card>

        <View className="gap-3">
          <View className="flex-row items-end justify-between gap-3">
            <Text className="text-xl font-extrabold text-ink">
              Privacy policy
            </Text>
            <Text className="text-[11px] font-medium text-muted">
              Updated {privacyPolicyUpdated}
            </Text>
          </View>
          <Card className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-green-light">
                <MaterialIcons name="shield" size={20} color="#0550DD" />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-sm font-bold text-ink">
                  Your data, clearly explained
                </Text>
                <Text className="text-[11px] text-muted">
                  This is a demo policy for the NPay prototype.
                </Text>
              </View>
            </View>
            <View className="h-px bg-gray-300" />
            <View className="gap-4">
              {privacyPolicySections.map((section) => (
                <View key={section.title} className="gap-1.5">
                  <Text className="text-sm font-extrabold text-ink">
                    {section.title}
                  </Text>
                  <Text className="text-[13px] leading-5 text-muted">
                    {section.body}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <Text className="text-center text-[11px] text-muted">
          © 2026 nPay · Developed by Taposh
        </Text>
      </Page>

      {sheetVisible ? (
        <CustomBottomSheet
          visible
          onClose={closeSheet}
          title={flow === "reset" ? "Reset M-PIN" : "Change M-PIN"}
          snapPoints={["88%", "96%"]}
        >
          <View className="gap-4 px-1 pb-2">
            {busy ? <Text className="text-sm text-muted">Please wait…</Text> : null}
            {demoOtp ? <Text className="text-sm text-green">Development phone OTP: {demoOtp}</Text> : null}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-extrabold uppercase tracking-[0.8px] text-green">
                  Step {stepNumber} of {totalSteps}
                </Text>
                <Text className="text-[10px] font-semibold uppercase tracking-[0.8px] text-muted">
                  {flow === "reset" ? "Password reset" : "M-PIN security"}
                </Text>
              </View>
              <View className="flex-row gap-1.5">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <View
                    key={`mpin-step-${index}`}
                    className={`h-1 flex-1 rounded-full ${
                      index < stepNumber ? "bg-green" : "bg-[#DCE4EF]"
                    }`}
                  />
                ))}
              </View>
            </View>

            <View className="items-center gap-2">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-green-light">
                <MaterialIcons
                  name={content.icon}
                  size={24}
                  color="#0550DD"
                />
              </View>
              <Text className="text-center text-lg font-extrabold text-ink">
                {content.title}
              </Text>
              <Text className="px-2 text-center text-sm leading-5 text-muted">
                {content.description}
              </Text>
              {step === "current" ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={startReset}
                  className="mt-1 items-center py-1"
                >
                  <Text className="text-sm font-bold text-green">
                    Forgot M-PIN? Reset it with your password
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {step === "password" ? (
              <>
                <Field
                  maxLength={64}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError("");
                  }}
                  placeholder="Account password"
                  keyboardType="visible-password"
                  secureTextEntry
                  error={error || undefined}
                />
                <Button label="Verify password" onPress={verifyPassword} />
                <Pressable
                  accessibilityRole="button"
                  onPress={backToMpin}
                  className="items-center py-1"
                >
                  <Text className="text-sm font-bold text-green">
                    Use M-PIN instead
                  </Text>
                </Pressable>
                <Text className="text-center text-[11px] leading-4.5 text-muted">
                  Use your account password (at least 8 characters).
                </Text>
              </>
            ) : step === "otp" ? (
              <>
                <View className="flex-row items-center gap-2.5 rounded-xl bg-green-light px-3.5 py-3">
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color="#0550DD"
                  />
                  <Text className="flex-1 text-xs leading-5 text-green">
                    OTP sent to your registered mobile number.
                  </Text>
                </View>
                <Field
                  maxLength={6}
                  value={otp}
                  onChangeText={(value) => {
                    setOtp(value.replace(/\D/g, "").slice(0, 6));
                    setError("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  keyboardType="numeric"
                  secureTextEntry
                  error={error || undefined}
                />
                <Button label="Verify OTP" onPress={verifyOtp} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setStep("password");
                    setOtp("");
                    setError("");
                  }}
                  className="items-center py-1"
                >
                  <Text className="text-sm font-bold text-green">
                    Use a different password
                  </Text>
                </Pressable>
                <Text className="text-center text-[11px] leading-4.5 text-muted">
                  Any 6-digit code works in this demo.
                </Text>
              </>
            ) : (
              <>
                <MpinEntry
                  pin={pin}
                  error={error}
                  onDigit={appendDigit}
                  onBackspace={removeDigit}
                  onDone={submitPin}
                />
                {step === "confirm" ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={backToNewMpin}
                    className="items-center py-1"
                  >
                    <Text className="text-sm font-bold text-green">
                      Change new M-PIN
                    </Text>
                  </Pressable>
                ) : null}
              </>
            )}
          </View>
        </CustomBottomSheet>
      ) : null}

      <SuccessDialog
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        buttonLabel={popup.buttonLabel}
        onClose={() => {
          setPopup((current) => ({ ...current, visible: false }));
        }}
      />
    </>
  );
}
