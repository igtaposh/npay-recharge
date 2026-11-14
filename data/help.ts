export type TeamContactId =
  | "founder"
  | "distributor"
  | "drm"
  | "arm";

export type TeamContact = {
  id: TeamContactId;
  role: string;
  roleFull: string;
  name: string;
  phone: string;
  whatsapp: string;
};

export const teamContacts: TeamContact[] = [
  {
    id: "founder",
    role: "Founder",
    roleFull: "Founder, nPay",
    name: "Atiar Ali",
    phone: "+91 98300 44551",
    whatsapp: "+91 98300 44552",
  },
  {
    id: "distributor",
    role: "Distributor",
    roleFull: "Distributor · Kolkata",
    name: "Subrata Das",
    phone: "+91 98300 11221",
    whatsapp: "+91 98300 11222",
  },
  {
    id: "drm",
    role: "DRM",
    roleFull: "District Relationship Manager",
    name: "Priya Nair",
    phone: "+91 98300 22331",
    whatsapp: "+91 98300 22332",
  },
  {
    id: "arm",
    role: "ARM",
    roleFull: "Area Relationship Manager",
    name: "Arnab Ghosh",
    phone: "+91 98300 33441",
    whatsapp: "+91 98300 33442",
  },
];

export const companyContact = {
  headOffice: "24 Park Street, Kolkata, West Bengal 700016",
  email: "support@npay.in",
  phone: "+91 33 4000 1234",
  whatsapp: "+91 98300 45678",
  hours: "Mon–Sat · 9:30 AM – 7:00 PM",
};

export type HelpFaq = {
  question: string;
  answer: string;
};

export const helpFaqs: HelpFaq[] = [
  {
    question: "How do commissions work?",
    answer:
      "Every successful recharge earns the company-wise rate shown in Settings → Commissions. Commission is calculated on the recharge amount and credited to your NPay wallet.",
  },
  {
    question: "How do I change my M-PIN?",
    answer:
      "Open Settings → Privacy & security → Change M-PIN. Confirm your current M-PIN, then enter and confirm your new 4-digit M-PIN. If you forgot it, choose the password and OTP reset option.",
  },
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
    question: "Who do I contact for help?",
    answer:
      "Use the team contacts at the top of this page. Your Distributor handles day-to-day needs, the DRM covers your district, and the ARM looks after the wider area.",
  },
  {
    question: "Is this a real payment app?",
    answer:
      "No. NPay is a UI prototype. It does not connect to a bank, telecom operator, or payment gateway. Team details and contact numbers here are demo data.",
  },
  {
    question: "Do I need internet for a recharge?",
    answer:
      "Yes. A live recharge needs an internet connection, but this demo runs locally. You can explore every screen without a real network request.",
  },
];
