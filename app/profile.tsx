import { SuccessDialog } from "@/components/success-dialog";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CustomBottomSheet from "../components/customBottomSheet";
import { Button, Card, Field, Page, PageHeading } from "../components/ui";

type EditableProfileField = "name" | "shopName" | "email";
type SheetMode = "name" | "shopName" | "email" | "password" | null;
type emailChangeStepType = "password" | "otp";
type passwordChangeStepType = "oldPassword" | "otp" | "newPassword";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    shopName: "Morgan Recharge Point",
    email: "alex.morgan@example.com",
    mobile: "+91 98765 43210",
    pan: "ABCDE •••• F",
    aadhaar: "•••• •••• 4821",
  });
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

  const updateName = () => {
    if (!name) {
      setError({
        name: "name",
        msg: "please enter a valid name.",
      });
      return;
    }
    if (!passwordName) {
      setError({
        name: "passwordName",
        msg: "please enter a valid password.",
      });
      return;
    }
    if (passwordName.length < 8) {
      setError({
        name: "passwordName",
        msg: "Password must be 8 digit or more long .",
      });
      return;
    }
    setProfile((current) => ({ ...current, name }));
    closeSheet();
  };
  const updateShopName = () => {
    if (!shopName) {
      setError({
        name: "shopName",
        msg: "please enter a valid shop name.",
      });
      return;
    }
    if (!passwordShopName) {
      setError({
        name: "passwordShopName",
        msg: "please enter a valid password.",
      });
      return;
    }
    if (passwordShopName.length < 8) {
      setError({
        name: "passwordShopName",
        msg: "Password must be 8 digit or more long .",
      });
      return;
    }
    setProfile((current) => ({ ...current, shopName }));
    closeSheet();
  };

  const updateEmailAddress = () => {
    if (!email) {
      setError({
        name: "email",
        msg: "please enter a valid email address.",
      });
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError({
        name: "email",
        msg: "please enter a valid email address.",
      });
      return;
    }
    if (!passwordEmail) {
      setError({
        name: "passwordEmail",
        msg: "please enter a valid password.",
      });
      return;
    }
    if (passwordEmail.length < 8) {
      setError({
        name: "passwordEmail",
        msg: "Password must be 8 digit or more long .",
      });
      return;
    }
    setPopup({
      visible: true,
      title: "OTP sent!",
      message: "A 6 Digit OTP has been sent to your enmail",
      buttonLabel: "OK",
    });
    setEmailChangeStep("otp");
  };

  const validateOtp = () => {
    if (!emailOtp) {
      setError({
        name: "emailOtp",
        msg: "please enter a valid OTP.",
      });
      return;
    }
    if (emailOtp.length < 6) {
      setError({
        name: "emailOtp",
        msg: "please enter a valid 6 digit OTP.",
      });
      return;
    }
    setProfile((current) => ({ ...current, email }));
    closeSheet();
  };

  const validatePassword = () => {
    if (!oldPassword) {
      setError({
        name: "oldPassword",
        msg: "please enter a valid password.",
      });
      return;
    }
    if (oldPassword.length < 8) {
      setError({
        name: "oldPassword",
        msg: "Password must be 8 digit or more long .",
      });
      return;
    }
    setPopup({
      visible: true,
      title: "OTP sent!",
      message: "A 6 Digit OTP has been sent to your phone",
      buttonLabel: "OK",
    });
    setPasswordChangeStep("otp");
  };
  const validatePhoneOtp = () => {
    if (!phoneOtp) {
      setError({
        name: "phoneOtp",
        msg: "please enter a valid OTP.",
      });
      return;
    }
    if (phoneOtp.length < 6) {
      setError({
        name: "phoneOtp",
        msg: "please enter a valid 6 digit OTP.",
      });
      return;
    }
    setPopup({
      visible: true,
      title: "OTP Verified!",
      message: "OTP Valideted successfully.",
      buttonLabel: "OK",
    });
    setPasswordChangeStep("newPassword");
  };
  const changePassword = () => {
    if (!newPassword) {
      setError({
        name: "newPassword",
        msg: "please enter a valid password.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setError({
        name: "newPassword",
        msg: "Password must be 8 digit or more long .",
      });
      return;
    }
    if (!confirmPassword) {
      setError({
        name: "confirmPassword",
        msg: "please enter a valid confirm password.",
      });
      return;
    }
    if (confirmPassword !== newPassword) {
      setError({
        name: "confirmPassword",
        msg: "Passwords do not match.",
      });
      return;
    }
    closeSheet();
  };
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
          <Button label="Submit" onPress={validatePassword} />
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
          <Button label="Verify OTP" onPress={validatePhoneOtp} />
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
          <Button label="Change Password" onPress={changePassword} />
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
              <Button label="Save changes" onPress={updateName} />
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
              <Button label="Save changes" onPress={updateShopName} />
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
                  <Button label="sent OTP" onPress={updateEmailAddress} />
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
                  <Button label="Verify OTP" onPress={validateOtp} />
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
