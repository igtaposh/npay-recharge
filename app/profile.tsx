import { useRecharge } from "../components/recharge-context";
import { api, errorMessage } from "../data/api";
import type { Challenge } from "../data/api-types";
import { SuccessDialog } from "@/components/success-dialog";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import CustomBottomSheet from "../components/customBottomSheet";
import { Button, Card, Field, Page, PageHeading } from "../components/ui";

type EditableProfileField = "name" | "shopName" | "email";
type SheetMode = "name" | "shopName" | "email" | "password" | null;
type emailChangeStepType = "password" | "otp";
type passwordChangeStepType = "oldPassword" | "otp" | "newPassword";

export default function ProfileScreen() {
  const router = useRouter();
  const { account, reloadProfile, signOut } = useRecharge();
  const profile = {name:account?.name||"",shopName:account?.business_name||"",email:account?.email||"",mobile:account?.phone||"",pan:account?.pan||"",aadhaar:account?.aadhaar||""};
  const [busy, setBusy] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [proof, setProof] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [emailChangeStep, setEmailChangeStep] =
    useState<emailChangeStepType>("password");
  const [passwordChangeStep, setPasswordChangeStep] =
    useState<passwordChangeStepType>("oldPassword");
  const [error, setError] = useState({
    name: "",
    msg: "",
  });
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    buttonLabel: "Continue",
  });
  const [passwordName, setPasswordname] = useState("");
  const [passwordShopName, setPasswordShopName] = useState("");
  const [passwordEmail, setPasswordEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function openEdit(field: EditableProfileField) {
    setSheetMode(field);
    setSheetVisible(true);
  }

  function resetSheetForm() {
    setChallengeId(""); setProof(""); setDemoOtp("");
    setName("");
    setPasswordname("");
    setShopName("");
    setPasswordShopName("");
    setEmail("");
    setPasswordEmail("");
    setEmailOtp("");
    setOldPassword("");
    setPhoneOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setEmailChangeStep("password");
    setPasswordChangeStep("oldPassword");
    setError({
      name: "",
      msg: "",
    });
  }

  function closeSheet() {
    setSheetVisible(false);
    setSheetMode(null);
    resetSheetForm();
  }

  function handleSheetClosed() {
    setSheetVisible(false);
    setSheetMode(null);
    resetSheetForm();
  }

  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);setError({name:"",msg:""});
    try {await action();}catch(error){setError({name:"api",msg:errorMessage(error)});}finally{setBusy(false);}
  };
  const updateName = () => run(async()=>{
    if (!name.trim()) throw new Error("Enter your name.");
    await api.request("profile",{name:name.trim(),current_password:passwordName},{method:"PATCH"});
    await reloadProfile();closeSheet();
  });
  const updateShopName = () => run(async()=>{
    if (!shopName.trim()) throw new Error("Enter your shop name.");
    await api.request("profile",{business_name:shopName.trim(),current_password:passwordShopName},{method:"PATCH"});
    await reloadProfile();closeSheet();
  });
  const updateEmailAddress = () => run(async()=>{
    const response=await api.request<Challenge>("security/otp/request",{purpose:"email_change",email:email.trim(),current_password:passwordEmail});
    setChallengeId(response.data.challenge_id);setDemoOtp(response.data.demo_otp||"");setEmailChangeStep("otp");
  });
  const validateOtp = () => run(async()=>{
    const verified=await api.request<{verification_token:string}>("security/otp/verify",{challenge_id:challengeId,otp:emailOtp});
    await api.request("security/email",{verification_token:verified.data.verification_token});
    await reloadProfile();closeSheet();
  });
  const validatePassword = () => run(async()=>{
    const response=await api.request<Challenge>("security/otp/request",{purpose:"password_change",current_password:oldPassword});
    setChallengeId(response.data.challenge_id);setDemoOtp(response.data.demo_otp||"");setPasswordChangeStep("otp");
  });
  const validatePhoneOtp = () => run(async()=>{
    const verified=await api.request<{verification_token:string}>("security/otp/verify",{challenge_id:challengeId,otp:phoneOtp});
    setProof(verified.data.verification_token);setDemoOtp("");setPasswordChangeStep("newPassword");
  });
  const changePassword = () => run(async()=>{
    if(newPassword.length<8)throw new Error("Use at least 8 characters.");
    if(newPassword!==confirmPassword)throw new Error("Passwords do not match.");
    await api.request("security/password",{verification_token:proof,new_password:newPassword});
    Alert.alert("Password updated","Sign in with your new password.");await signOut(false);
  });
  const renderFields = () => {
    if (passwordChangeStep === "oldPassword") {
      return (
        <>
          <Text className="text-sm leading-5 mb-4 text-muted">
            Update your current password. Your old password and a OTP is
            required to confirm this change.
          </Text>
          <Field
            maxLength={64}
            value={oldPassword}
            onChangeText={(value) => {
              setOldPassword(value);
              setError({
                name: "",
                msg: "",
              });
            }}
            placeholder="Current password"
            keyboardType="visible-password"
            secureTextEntry
            error={error.name === "oldPassword" ? error.msg : undefined}
          />
          <Button disabled={busy} label="Submit" onPress={validatePassword} />
          <Text className="text-center text-[11px] leading-4.5 text-muted">
            By using this, you agree to NPay&apos;s Terms &amp; Conditions and
            Privacy Policy.
          </Text>
        </>
      );
    } else if (passwordChangeStep === "otp") {
      return (
        <>
          <Text className="text-sm leading-5 mb-4 text-muted">
            To update your current password. Please verify a 6 digit otp has
            been sent to your phone.
          </Text>
          <Field
            maxLength={6}
            value={phoneOtp}
            onChangeText={(value) => {
              setPhoneOtp(value);
              setError({
                name: "",
                msg: "",
              });
            }}
            placeholder="Enter OTP"
            keyboardType="numeric"
            secureTextEntry
            error={error.name === "phoneOtp" ? error.msg : undefined}
          />
          <Button disabled={busy} label="Verify OTP" onPress={validatePhoneOtp} />
          <Text className="text-center text-[11px] leading-4.5 text-muted">
            By using this, you agree to NPay&apos;s Terms &amp; Conditions and
            Privacy Policy.
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text className="text-sm leading-5 mb-4 text-muted">
            To update your current password. Please enter new strong password
            twice.
          </Text>
          <Field
            maxLength={100}
            value={newPassword}
            onChangeText={(value) => {
              setNewPassword(value);
              setError({
                name: "",
                msg: "",
              });
            }}
            placeholder="New Password"
            keyboardType="visible-password"
            secureTextEntry
            error={error.name === "newPassword" ? error.msg : undefined}
          />
          <Field
            maxLength={100}
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError({
                name: "",
                msg: "",
              });
            }}
            placeholder="Confirm Password"
            keyboardType="visible-password"
            secureTextEntry
            error={error.name === "confirmPassword" ? error.msg : undefined}
          />
          <Button disabled={busy} label="Change Password" onPress={changePassword} />
          <Text className="text-center text-[11px] leading-4.5 text-muted">
            By using this, you agree to NPay&apos;s Terms &amp; Conditions and
            Privacy Policy.
          </Text>
        </>
      );
    }
  };

  return (
    <>
      <Page>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-[15px] border border-line bg-white"
        >
          <MaterialIcons name="arrow-back" size={22} color="#172B4D" />
        </Pressable>
        <PageHeading
          eyebrow="YOUR ACCOUNT"
          title="My profile"
          subtitle="Manage your personal and business details."
        />

        <Card className="flex-row items-center gap-4 p-5">
          <View className="h-19 w-19 items-center justify-center rounded-[26px] border-4 border-green-light bg-[#DCE8FF]">
            <Text className="text-[25px] font-extrabold text-green">
              {initials}
            </Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-xl font-extrabold text-ink">
              {profile.name}
            </Text>
            <Text className="text-sm text-muted">{profile.mobile}</Text>
            <View className="mt-1 flex-row items-center gap-1.5">
              <Ionicons name="shield-checkmark" size={14} color="#168A73" />
              <Text className="text-xs font-bold text-green">
                Verified NPay partner
              </Text>
            </View>
          </View>
        </Card>

        <View className="gap-3">
          <Text className="text-xl font-extrabold text-ink">
            Personal details
          </Text>
          <Card className="gap-0 px-4 py-1">
            <ProfileDetailRow
              label="Full name"
              value={profile.name}
              onEdit={() => openEdit("name")}
            />
            <ProfileDetailRow
              label="Shop name"
              value={profile.shopName}
              onEdit={() => openEdit("shopName")}
            />
            <ProfileDetailRow
              label="Email address"
              value={profile.email}
              onEdit={() => openEdit("email")}
            />
            <ProfileDetailRow label="Mobile number" value={profile.mobile} />
            <ProfileDetailRow label="PAN" value={profile.pan} />
            <ProfileDetailRow label="Aadhaar" value={profile.aadhaar} last />
          </Card>
        </View>

        <Card className="gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-[#EEF4FF]">
              <Ionicons name="lock-closed" size={20} color="#0550DD" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-base font-extrabold text-ink">
                Password &amp; security
              </Text>
              <Text className="text-xs leading-5 text-muted">
                Update your password with phone verification.
              </Text>
            </View>
          </View>
          <Button
            disabled={busy}
            label="Change password"
            variant="ghost"
            onPress={() => {
              setError({
                name: "",
                msg: "",
              });
              setSheetMode("password");
              setSheetVisible(true);
            }}
          />
        </Card>
        <SuccessDialog
          visible={popup.visible}
          title={popup.title}
          message={popup.message}
          buttonLabel={popup.buttonLabel}
          onClose={() => {
            setPopup((current) => ({ ...current, visible: false }));
          }}
        />
      </Page>

      {sheetVisible && (
        <CustomBottomSheet
          visible
          onClose={handleSheetClosed}
          title={
            sheetMode === "name"
              ? "Edit Full name"
              : sheetMode === "shopName"
                ? "Edit shop name"
                : sheetMode === "email"
                  ? "Update email address"
                  : sheetMode === "password"
                    ? "Change Password"
                    : undefined
          }
          snapPoints={["72%", "90%"]}
        >
          {error.name === "api" ? <Text className="text-sm text-danger">{error.msg}</Text> : null}
          {demoOtp ? <Text className="text-sm text-green">Development OTP: {demoOtp}</Text> : null}
          {busy ? <Text className="text-sm text-muted">Please wait…</Text> : null}
          {sheetMode === "name" && (
            <View className="gap-4">
              <Text className="text-sm mb-4 leading-5 text-muted">
                Update your full name. Your password is required to confirm this
                change.
              </Text>
              <Field
                maxLength={254}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setError({ name: "", msg: "" });
                }}
                placeholder="Enter full name"
                keyboardType="default"
                error={error.name === "name" ? error.msg : undefined}
              />
              <Field
                maxLength={64}
                value={passwordName}
                onChangeText={(value) => {
                  setPasswordname(value);
                  setError({ name: "", msg: "" });
                }}
                placeholder="Current password"
                keyboardType="visible-password"
                secureTextEntry
                error={error.name === "passwordName" ? error.msg : undefined}
              />
              <Button disabled={busy} label="Save changes" onPress={updateName} />
              <Text className="text-center text-[11px] leading-4.5 text-muted">
                By using this, you agree to NPay&apos;s Terms &amp; Conditions
                and Privacy Policy.
              </Text>
            </View>
          )}
          {sheetMode === "shopName" && (
            <View className="gap-4">
              <Text className="text-sm leading-5 mb-4 text-muted">
                Update your shop name. Your password is required to confirm this
                change.
              </Text>
              <Field
                maxLength={100}
                value={shopName}
                onChangeText={(value) => {
                  setShopName(value);
                  setError({ name: "", msg: "" });
                }}
                placeholder="Enter shop name"
                keyboardType="default"
                error={error.name === "shopName" ? error.msg : undefined}
              />
              <Field
                maxLength={64}
                value={passwordShopName}
                onChangeText={(value) => {
                  setPasswordShopName(value);
                  setError({ name: "", msg: "" });
                }}
                placeholder="Current password"
                keyboardType="visible-password"
                secureTextEntry
                error={
                  error.name === "passwordShopName" ? error.msg : undefined
                }
              />
              <Button disabled={busy} label="Save changes" onPress={updateShopName} />
              <Text className="text-center text-[11px] leading-4.5 text-muted">
                By using this, you agree to NPay&apos;s Terms &amp; Conditions
                and Privacy Policy.
              </Text>
            </View>
          )}
          {sheetMode === "email" && (
            <View className="gap-4">
              {emailChangeStep === "password" ? (
                <>
                  <Text className="text-sm leading-5 mb-4 text-muted">
                    Update your email address. Your password is required to
                    confirm this change.
                  </Text>
                  <Field
                    maxLength={254}
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setError({ name: "", msg: "" });
                    }}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    error={error.name === "email" ? error.msg : undefined}
                  />
                  <Field
                    maxLength={64}
                    value={passwordEmail}
                    onChangeText={(value) => {
                      setPasswordEmail(value);
                      setError({ name: "", msg: "" });
                    }}
                    placeholder="Current password"
                    keyboardType="visible-password"
                    secureTextEntry
                    error={
                      error.name === "passwordEmail" ? error.msg : undefined
                    }
                  />
                  <Button disabled={busy} label="sent OTP" onPress={updateEmailAddress} />
                  <Text className="text-center text-[11px] leading-4.5 text-muted">
                    By using this, you agree to NPay&apos;s Terms &amp;
                    Conditions and Privacy Policy.
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-sm leading-5 mb-4 text-muted">
                    To update your email address, verify the 6 digit OTP sent to
                    your email.
                  </Text>
                  <Field
                    maxLength={6}
                    value={emailOtp}
                    onChangeText={(value) => {
                      setEmailOtp(value);
                      setError({ name: "", msg: "" });
                    }}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                    secureTextEntry
                    error={error.name === "emailOtp" ? error.msg : undefined}
                  />
                  <Button disabled={busy} label="Verify OTP" onPress={validateOtp} />
                  <Text className="text-center text-[11px] leading-4.5 text-muted">
                    By using this, you agree to NPay&apos;s Terms &amp;
                    Conditions and Privacy Policy.
                  </Text>
                </>
              )}
            </View>
          )}
          {sheetMode === "password" && (
            <View className="gap-4">{renderFields()}</View>
          )}
        </CustomBottomSheet>
      )}
    </>
  );
}

function ProfileDetailRow({
  label,
  value,
  onEdit,
  last = false,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  last?: boolean;
}) {
  return (
    <View className={`gap-1.5 py-4 ${last ? "" : "border-b border-gray-300"}`}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-xs font-semibold text-muted">{label}</Text>
        {onEdit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${label.toLowerCase()}`}
            onPress={onEdit}
            className="flex-row items-center gap-1.5 rounded-full bg-green-light px-3 py-1.5"
          >
            <Ionicons name="create-outline" size={15} color="#168A73" />
            <Text className="text-xs font-bold text-green">Edit</Text>
          </Pressable>
        ) : (
          <Ionicons name="lock-closed" size={13} color="#9AA8B8" />
        )}
      </View>
      <Text className="text-[15px] font-semibold text-ink">{value}</Text>
    </View>
  );
}
