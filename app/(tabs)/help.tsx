import Ionicons from "@react-native-vector-icons/ionicons/static";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Card, Page, PageHeading } from "../../components/ui";
import {
  companyContact,
  helpFaqs,
  teamContacts,
  type TeamContact,
  type TeamContactId,
} from "../../data/help";

const teamPhotos: Record<TeamContactId, ImageSourcePropType> = {
  founder: require("../../assets/team/atiar-ali.jpg"),
  distributor: require("../../assets/team/distributor.jpg"),
  drm: require("../../assets/team/drm.jpg"),
  arm: require("../../assets/team/arm.jpg"),
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function callNumber(phone: string) {
  void Linking.openURL(`tel:+${digitsOnly(phone)}`);
}

function openWhatsApp(number: string) {
  const message = encodeURIComponent("Hi, I need help with my nPay recharge.");
  void Linking.openURL(`https://wa.me/${digitsOnly(number)}?text=${message}`);
}

function TeamCard({ member }: { member: TeamContact }) {
  return (
    <View className="min-h-[238px] w-[236px] gap-3.5 rounded-xl border border-gray-300 bg-white p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 overflow-hidden rounded-[18px] border border-line bg-[#EEF4FF]">
          <Image
            accessibilityLabel={`${member.name} photo`}
            source={teamPhotos[member.id]}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        </View>
        <View className="min-h-[58px] flex-1 justify-center gap-0.5">
          <Text className="text-[10px] font-extrabold uppercase tracking-[0.7px] text-green">
            {member.role}
          </Text>
          <Text
            numberOfLines={1}
            className="text-[15px] font-extrabold text-ink"
          >
            {member.name}
          </Text>
          <Text
            numberOfLines={2}
            className="text-[10px] leading-3.5 text-muted"
          >
            {member.roleFull}
          </Text>
        </View>
      </View>

      <View className="gap-1.5 rounded-xl bg-[#F8FAFD] px-3 py-2.5">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="call" size={14} color="#0550DD" />
          <Text className="text-[9px] font-bold uppercase tracking-[0.4px] text-muted">
            Call
          </Text>
          <Text
            numberOfLines={1}
            className="flex-1 text-right text-[11px] font-semibold text-ink"
          >
            {member.phone}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="logo-whatsapp" size={14} color="#168A73" />
          <Text className="text-[9px] font-bold uppercase tracking-[0.4px] text-muted">
            WhatsApp
          </Text>
          <Text
            numberOfLines={1}
            className="flex-1 text-right text-[11px] font-semibold text-ink"
          >
            {member.whatsapp}
          </Text>
        </View>
      </View>

      <View className="mt-auto flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Call ${member.name}`}
          onPress={() => callNumber(member.phone)}
          className="min-h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-[12px] border border-line bg-white"
        >
          <MaterialIcons name="call" size={15} color="#0550DD" />
          <Text className="text-xs font-bold text-green">Call</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`WhatsApp ${member.name}`}
          onPress={() => openWhatsApp(member.whatsapp)}
          className="min-h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-[12px] border border-[#CBEBDD] bg-[#EFFAF5]"
        >
          <Ionicons name="logo-whatsapp" size={15} color="#168A73" />
          <Text className="text-[11px] font-bold text-[#168A73]">
            WhatsApp
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function CompanyContactRow({
  icon,
  label,
  value,
  onPress,
  last = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const className = `flex-row items-center gap-3.5 py-3.5 ${
    last ? "" : "border-b border-gray-300"
  }`;
  const content = (
    <>
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-green-light">
        {icon}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[10px] font-bold uppercase tracking-[0.6px] text-muted">
          {label}
        </Text>
        <Text className="text-[13px] font-semibold leading-5 text-ink">
          {value}
        </Text>
      </View>
      {onPress ? (
        <MaterialIcons name="chevron-right" size={20} color="#68788F" />
      ) : null}
    </>
  );

  if (!onPress) {
    return <View className={className}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      className={className}
    >
      {content}
    </Pressable>
  );
}

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Page>
      <PageHeading
        eyebrow="WE'RE HERE FOR YOU"
        title="Help & support"
        subtitle="Talk to your nPay team or find a quick answer."
      />

      <View className="gap-3">
        <View className="flex-row items-end justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-xl font-extrabold text-ink">
              Your nPay team
            </Text>
            <Text className="text-xs leading-5 text-muted">
              Reach the right person for your area.
            </Text>
          </View>
          <View className="rounded-full bg-green-light px-2.5 py-1">
            <Text className="text-[9px] font-extrabold uppercase tracking-[0.6px] text-green">
              Swipe →
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4, paddingBottom: 2 }}
          style={{ flexGrow: 0 }}
        >
          {teamContacts.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </ScrollView>
      </View>

      <View className="gap-3">
        <View className="gap-1">
          <Text className="text-xl font-extrabold text-ink">
            Company contact
          </Text>
          <Text className="text-xs leading-5 text-muted">
            For account, recharge or partnership help.
          </Text>
        </View>
        <Card className="gap-0 p-4">
          <CompanyContactRow
            icon={
              <MaterialIcons name="location-on" size={20} color="#0550DD" />
            }
            label="Head office"
            value={companyContact.headOffice}
          />
          <CompanyContactRow
            icon={<MaterialIcons name="mail" size={20} color="#0550DD" />}
            label="Email"
            value={companyContact.email}
            onPress={() => {
              void Linking.openURL(`mailto:${companyContact.email}`);
            }}
          />
          <CompanyContactRow
            icon={<MaterialIcons name="call" size={20} color="#0550DD" />}
            label="Phone"
            value={companyContact.phone}
            onPress={() => callNumber(companyContact.phone)}
          />
          <CompanyContactRow
            icon={
              <Ionicons name="logo-whatsapp" size={20} color="#0550DD" />
            }
            label="WhatsApp"
            value={companyContact.whatsapp}
            onPress={() => openWhatsApp(companyContact.whatsapp)}
          />
          <CompanyContactRow
            icon={<MaterialIcons name="schedule" size={20} color="#0550DD" />}
            label="Support hours"
            value={companyContact.hours}
            last
          />
        </Card>
      </View>

      <View className="gap-3">
        <View className="flex-row items-end justify-between gap-3">
          <Text className="text-xl font-extrabold text-ink">
            Frequently asked
          </Text>
          <Text className="text-xs font-medium text-muted">
            {helpFaqs.length} answers
          </Text>
        </View>
        <View className="rounded-xl border border-gray-300 bg-white px-4">
          {helpFaqs.map((faq, index) => {
            const isExpanded = expanded === index;
            return (
              <Pressable
                key={faq.question}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                onPress={() =>
                  setExpanded((current) => (current === index ? null : index))
                }
                className="gap-2.5 border-b border-line py-4 last:border-b-0"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="flex-1 text-md font-bold leading-5 text-ink">
                    {faq.question}
                  </Text>
                  <Text className="text-2xl font-semibold text-green">
                    {isExpanded ? "−" : "+"}
                  </Text>
                </View>
                {isExpanded ? (
                  <Text className="pr-5 text-[13px] leading-5 text-muted">
                    {faq.answer}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text className="text-center text-xs text-muted">
        Team contacts and company details are for demonstration only.
      </Text>
    </Page>
  );
}
