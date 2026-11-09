import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Card, Page, PageHeading } from "../../components/ui";

const faqs = [
  { question: "How do I recharge a mobile number?", answer: "Choose Prepaid on the home screen, enter the mobile number, pick a plan and confirm. This demo records the recharge locally without charging you." },
  { question: "Where can I see my past recharges?", answer: "Open Recharge history from the bottom navigation to review the activity saved during this app session." },
  { question: "How do I add money to my wallet?", answer: "Tap Add balance on the home screen, choose or enter an amount, then confirm. The demo balance updates locally." },
  { question: "Is this a real payment app?", answer: "No. NPay is a UI prototype. It does not connect to a bank, telecom operator, or payment gateway." },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <Page activeTab="Help">
      <PageHeading eyebrow="WE'RE HERE FOR YOU" title="Help & support" subtitle="Quick answers to common questions." />
      <Card className="items-start gap-[9px] p-5">
        <View className="h-[43px] w-[43px] items-center justify-center rounded-[15px] bg-green-light"><Text className="text-xl text-green">✦</Text></View>
        <Text className="text-[17px] font-extrabold text-ink">Need a hand?</Text>
        <Text className="text-[13px] leading-[19px] text-muted">Browse quick answers or learn a little more about this demo.</Text>
        <Pressable accessibilityRole="button" onPress={() => setExpanded(3)} className="pt-1">
          <Text className="text-[13px] font-extrabold text-green">Learn about this demo  →</Text>
        </Pressable>
      </Card>
      <Text className="-mb-[11px] text-[17px] font-extrabold text-ink">Frequently asked</Text>
      <View className="rounded-[20px] bg-white px-4">
        {faqs.map((faq, index) => {
          const isExpanded = expanded === index;
          return (
            <Pressable
              key={faq.question}
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              onPress={() => setExpanded(isExpanded ? null : index)}
              className="gap-2.5 border-b border-line py-4 last:border-b-0"
            >
              <View className="flex-row items-center gap-3">
                <Text className="flex-1 text-[13px] font-bold leading-[19px] text-ink">{faq.question}</Text>
                <Text className="text-xl font-semibold text-green">{isExpanded ? "−" : "+"}</Text>
              </View>
              {isExpanded ? <Text className="pr-5 text-xs leading-[19px] text-muted">{faq.answer}</Text> : null}
            </Pressable>
          );
        })}
      </View>
      <Text className="text-center text-[10px] text-muted">Support for this prototype is for demonstration only.</Text>
    </Page>
  );
}
