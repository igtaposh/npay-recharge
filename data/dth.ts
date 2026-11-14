export const dthProviders = [
  {
    id: "tata-play",
    name: "Tata Play",
    digits: 10,
    sampleNumber: "1001234567",
    numberName: "subscriber ID",
  },
  {
    id: "airtel-dth",
    name: "Airtel Digital TV",
    digits: 10,
    sampleNumber: "3012345678",
    numberName: "customer ID",
  },
  {
    id: "dishtv",
    name: "Dish TV",
    digits: 11,
    sampleNumber: "01512345678",
    numberName: "VC number",
  },
  {
    id: "d2h",
    name: "d2h",
    digits: 11,
    sampleNumber: "10234567890",
    numberName: "VC number",
  },
  {
    id: "sun-direct",
    name: "Sun Direct",
    digits: 11,
    sampleNumber: "40123456789",
    numberName: "smart card number",
  },
] as const;

export type DthProviderId = (typeof dthProviders)[number]["id"];

export type DthPlan = {
  name: string;
  channels: string;
  amount: number;
  validity: string;
};

export type DthCustomer = {
  consumerNumber: string;
  name: string;
  status: "Active" | "Inactive";
  plan: DthPlan;
  dueAmount: number;
  dueDate: string;
};

const names = [
  "Rahul Sharma",
  "Priya Nair",
  "Amit Verma",
  "Sneha Iyer",
  "Karthik Rajan",
  "Meera Joshi",
  "Arjun Patel",
  "Fatima Khan",
  "Vikram Singh",
  "Ananya Das",
  "Rohit Menon",
  "Divya Kapoor",
];

const plansByProvider: Record<DthProviderId, DthPlan[]> = {
  "tata-play": [
    {
      name: "Hindi HD Family",
      channels: "350+ channels",
      amount: 349,
      validity: "30 days",
    },
    {
      name: "Sports HD",
      channels: "280+ channels",
      amount: 399,
      validity: "30 days",
    },
    {
      name: "Basic SD",
      channels: "180+ channels",
      amount: 249,
      validity: "30 days",
    },
  ],
  "airtel-dth": [
    {
      name: "Mega HD",
      channels: "320+ channels",
      amount: 399,
      validity: "30 days",
    },
    {
      name: "Value Sports",
      channels: "260+ channels",
      amount: 349,
      validity: "30 days",
    },
    {
      name: "Mini Pack",
      channels: "150+ channels",
      amount: 229,
      validity: "30 days",
    },
  ],
  dishtv: [
    {
      name: "Super Family",
      channels: "240+ channels",
      amount: 320,
      validity: "30 days",
    },
    {
      name: "All Sports HD",
      channels: "210+ channels",
      amount: 370,
      validity: "30 days",
    },
    {
      name: "Joy Pack",
      channels: "140+ channels",
      amount: 199,
      validity: "30 days",
    },
  ],
  d2h: [
    {
      name: "Gold HD",
      channels: "300+ channels",
      amount: 365,
      validity: "30 days",
    },
    {
      name: "Family Delight",
      channels: "220+ channels",
      amount: 299,
      validity: "30 days",
    },
    {
      name: "South Special",
      channels: "190+ channels",
      amount: 275,
      validity: "30 days",
    },
  ],
  "sun-direct": [
    {
      name: "Tamil HD Prime",
      channels: "220+ channels",
      amount: 280,
      validity: "30 days",
    },
    {
      name: "All South HD",
      channels: "250+ channels",
      amount: 330,
      validity: "30 days",
    },
    {
      name: "Starter Pack",
      channels: "120+ channels",
      amount: 179,
      validity: "30 days",
    },
  ],
};

const sampleCustomers: Record<DthProviderId, DthCustomer> = {
  "tata-play": {
    consumerNumber: "1001234567",
    name: "Rahul Sharma",
    status: "Active",
    plan: plansByProvider["tata-play"][0],
    dueAmount: 349,
    dueDate: "18 Nov 2026",
  },
  "airtel-dth": {
    consumerNumber: "3012345678",
    name: "Priya Nair",
    status: "Active",
    plan: plansByProvider["airtel-dth"][0],
    dueAmount: 399,
    dueDate: "21 Nov 2026",
  },
  dishtv: {
    consumerNumber: "01512345678",
    name: "Amit Verma",
    status: "Active",
    plan: plansByProvider.dishtv[0],
    dueAmount: 320,
    dueDate: "2 Dec 2026",
  },
  d2h: {
    consumerNumber: "10234567890",
    name: "Sneha Iyer",
    status: "Active",
    plan: plansByProvider.d2h[0],
    dueAmount: 365,
    dueDate: "15 Nov 2026",
  },
  "sun-direct": {
    consumerNumber: "40123456789",
    name: "Karthik Rajan",
    status: "Active",
    plan: plansByProvider["sun-direct"][0],
    dueAmount: 280,
    dueDate: "9 Dec 2026",
  },
};

function seedFrom(value: string) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function providerInitials(name: string) {
  const compact = name.replace(/[^A-Za-z0-9]/g, "");
  if (compact.length <= 3) return compact.toUpperCase();

  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function lookupDthCustomer(
  providerId: DthProviderId,
  consumerNumber: string,
): DthCustomer {
  const sample = sampleCustomers[providerId];
  if (sample.consumerNumber === consumerNumber) return sample;

  const plans = plansByProvider[providerId];
  const seed = seedFrom(consumerNumber);
  const plan = plans[seed % plans.length];
  const inactive = consumerNumber.endsWith("9");
  const day = (seed % 27) + 1;
  const months = ["Nov 2026", "Dec 2026", "Jan 2027"];

  return {
    consumerNumber,
    name: names[seed % names.length],
    status: inactive ? "Inactive" : "Active",
    plan,
    dueAmount: inactive ? plan.amount * 2 : plan.amount,
    dueDate: `${day} ${months[seed % months.length]}`,
  };
}
