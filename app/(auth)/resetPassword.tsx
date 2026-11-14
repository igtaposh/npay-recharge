import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SuccessDialog } from "../../components/success-dialog";
import { Button, Field, Page } from "../../components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("sent-otp");
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    buttonLabel: "Continue",
  });
  const [error, setError] = useState({
    name: "",
    msg: "",
  });

  const submitOTP = () => {
    if (!/^\d{10}$/.test(phone.trim())) {
      setError({
        name: "phone",
        msg: "Enter a valid 10-digit number.",
      });
      return;
    }

    setError({ name: "", msg: "" });
    setPopup({
      visible: true,
      title: "OTP sent",
      message: "A 6-digit OTP has been sent to your registered mobile number.",
      buttonLabel: "Continue",
    });
    setStep("verify-otp");
  };

  const verifyOTP = () => {
    if (!/^[0-9]{6}$/.test(otp.trim())) {
      setError({
        name: "otp",
        msg: "Enter a valid 6-digit OTP.",
      });
      return;
    }

    setError({ name: "", msg: "" });
    setPopup({
      visible: true,
      title: "OTP verified",
      message: "You can now create a new password for your account",
      buttonLabel: "Continue",
    });
    setStep("");
  };

  const resetPassword = () => {
    if (password.length < 6) {
      setError({
        name: "password",
        msg: "Use at least 6 characters for the new password.",
      });
      return;
    }
    if (password !== confirmPassword) {
      setError({
        name: "confirmPassword",
        msg: "Passwords do not match.",
      });
      return;
    }

    setError({ name: "", msg: "" });
    setPopup({
      visible: true,
      title: "Password updated",
      message:
        "Your password has been successfully updated. Please sign in with your new password.",
      buttonLabel: "Sign in",
    });
  };

  const renderFields = () => {
    if (step === "sent-otp") {
      return (
        <>
          <Field
            maxLength={10}
            value={phone}
            onChangeText={(value) => {
              setPhone(value.replace(/\D/g, "").slice(0, 10));
              if (error.name === "phone") setError({ name: "", msg: "" });
            }}
            placeholder="Mobile / User ID"
            keyboardType="phone-pad"
            error={error.name === "phone" ? error.msg : undefined}
          />
          <Button label="Send OTP" onPress={submitOTP} />
        </>
      );
    }

    if (step === "verify-otp") {
      return (
        <>
          <Field
            maxLength={6}
            value={otp}
            onChangeText={(value) => {
              setOtp(value.replace(/\D/g, "").slice(0, 6));
              if (error.name === "otp") setError({ name: "", msg: "" });
            }}
            keyboardType="numeric"
            placeholder="Enter OTP"
            error={error.name === "otp" ? error.msg : undefined}
          />
          <Button label="Verify OTP" onPress={verifyOTP} />
        </>
      );
    }

    return (
      <>
        <Field
          maxLength={16}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error.name === "password" || error.name === "confirmPassword") {
              setError({ name: "", msg: "" });
            }
          }}
          keyboardType="visible-password"
          placeholder="New password"
          error={error.name === "password" ? error.msg : undefined}
          secureTextEntry
        />
        <Field
          maxLength={16}
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            if (error.name === "confirmPassword" || error.name === "password") {
              setError({ name: "", msg: "" });
            }
          }}
          keyboardType="visible-password"
          placeholder="Confirm password"
          error={error.name === "confirmPassword" ? error.msg : undefined}
          secureTextEntry
        />
        <Button label="Change Password" onPress={resetPassword} />
      </>
    );
  };

  return (
    <Page walletBar={false}>
      <View
        accessibilityLabel="NPay password security illustration"
        className="relative h-43.5 items-center justify-center overflow-hidden rounded-[30px] bg-[#EEF5FF]"
      >
        <View className="absolute -right-7 -top-12 h-36 w-36 rounded-full bg-[#DCEBFF]" />
        <View className="absolute -bottom-16 -left-7 h-36 w-36 rounded-full bg-[#DCEBFF]" />
        <View className="absolute left-[20%] top-5 h-2.5 w-2.5 rounded-full bg-[#9CC0FF]" />
        <View className="absolute right-[18%] bottom-8 h-2 w-2 rounded-full bg-[#9CC0FF]" />

        <View className="relative h-[136px] w-[100px] items-center rounded-[26px] border-[4px] border-white bg-[#0550DD] p-2.5 shadow-lg">
          <View className="mb-3 h-1 w-7 rounded-full bg-white/70" />
          <View className="h-11 w-11 items-center justify-center rounded-[16px] bg-white">
            <MaterialIcons name="lock" size={26} color="#0550DD" />
          </View>
          <View className="mt-3 h-1.5 w-12 rounded-full bg-white/80" />
          <View className="mt-1.5 h-1.5 w-9 rounded-full bg-white/50" />
          <View className="absolute -right-5 bottom-3 h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#EEF5FF] bg-white">
            <MaterialIcons name="check" size={18} color="#168A73" />
          </View>
        </View>

        <View className="absolute left-[18%] top-9 h-10 w-10 items-center justify-center rounded-[14px] border-2 border-[#EEF5FF] bg-white shadow-sm">
          <MaterialIcons name="security" size={20} color="#168A73" />
        </View>
        <View className="absolute right-[19%] top-9 h-9 w-9 items-center justify-center rounded-full bg-white/90">
          <MaterialIcons name="vpn-key" size={18} color="#0550DD" />
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-center font-extrabold tracking-[1px] text-green">
          SECURE ACCESS
        </Text>
        <Text className="text-center text-[30px] font-extrabold tracking-[-0.7px] text-ink">
          Reset your password
        </Text>
        <Text className="text-center text-[15px] leading-5.5 text-muted">
          Create a new secure password to continue your NPay account.
        </Text>
      </View>

      <View className="gap-4">{renderFields()}</View>

      <Text className="text-center text-[11px] leading-4.5 text-muted">
        By using this, you agree to NPay&apos;s Terms &amp; Conditions and
        Privacy Policy.
      </Text>

      <SuccessDialog
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        buttonLabel={popup.buttonLabel}
        onClose={() => {
          setPopup((current) => ({ ...current, visible: false }));
          if (popup.buttonLabel === "Sign in") {
            router.replace("/(auth)/login");
          }
        }}
      />
    </Page>
  );
}
