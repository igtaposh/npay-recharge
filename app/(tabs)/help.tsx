import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Card, Page, PageHeading } from "../../components/ui";

const faqs = [
  {
    question: "How do I recharge a mobile number?",
    answer:
      "Choose Prepaid on the home screen, enter the mobile number, pick a plan and confirm. This demo records the recharge locally without charging you.",
  },
  {
    question: "Where can I see my past recharges?",
    answer:
      "Open Recharge history from the bottom navigation to review the activity saved during this app session.",
  },
  {
    question: "How do I add money to my wallet?",
    answer:
      "Tap Add balance on the home screen, choose or enter an amount, then confirm. The demo balance updates locally.",
  },
  {
    question: "Is this a real payment app?",
    answer:
      "No. NPay is a UI prototype. It does not connect to a bank, telecom operator, or payment gateway.",
  },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Page>
      <PageHeading
        eyebrow="WE'RE HERE FOR YOU"
        title="Help & support"
        subtitle="Quick answers to common questions."
      />
      <Card className="items-start gap-[9px] p-5">
        <View className="h-[43px] w-[43px] items-center justify-center rounded-[15px] bg-green-light">
          <Text className="text-xl text-green">✦</Text>
        </View>
        <Text className="text-[17px] font-extrabold text-ink">
          Need a hand?
        </Text>
        <Text className="text-sm leading-[21px] text-muted">
          Browse quick answers or learn a little more about this demo.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded(3)}
          className="pt-1"
        >
          <Text className="text-sm font-extrabold text-green">
            Learn about this demo →
          </Text>
        </Pressable>
      </Card>
      <Text className="-mb-2 text-lg font-extrabold text-ink">
        Frequently asked
      </Text>
      <View className="rounded-xl border border-gray-300 bg-white px-4">
        {faqs.map((faq, index) => {
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
              <View className="flex-row items-center gap-3" >
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
      <Text className="text-center text-xs text-muted">
        Support for this prototype is for demonstration only.
      </Text>
    </Page>
  );
}
