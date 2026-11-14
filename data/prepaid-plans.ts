export type PlanCategoryId =
  | "popular"
  | "unlimited"
  | "data"
  | "talktime"
  | "isd"
  | "topup";

export type PrepaidPlan = {
  id: string;
  amount: number;
  data: string;
  validity: string;
  description: string;
  category: PlanCategoryId;
  tag?: string;
};

export const planCategories: {
  id: PlanCategoryId;
  label: string;
}[] = [
  { id: "popular", label: "Popular" },
  { id: "unlimited", label: "Unlimited" },
  { id: "data", label: "Data" },
  { id: "talktime", label: "Talktime" },
  { id: "isd", label: "ISD" },
  { id: "topup", label: "TopUp" },
];

export const prepaidPlans: PrepaidPlan[] = [
  {
    id: "pop-199",
    amount: 199,
    data: "1.5 GB/day",
    validity: "28 days",
    description: "Unlimited calls + 100 SMS/day. Ideal everyday pack.",
    category: "popular",
    tag: "Most chosen",
  },
  {
    id: "pop-299",
    amount: 299,
    data: "2 GB/day",
    validity: "28 days",
    description: "Extra daily data with unlimited voice across India.",
    category: "popular",
    tag: "Best value",
  },
  {
    id: "pop-399",
    amount: 399,
    data: "2 GB/day",
    validity: "28 days",
    description: "Extra daily data with unlimited voice across India.",
    category: "popular",
    tag: "Best value",
  },
  {
    id: "pop-499",
    amount: 499,
    data: "2 GB/day",
    validity: "28 days",
    description: "Extra daily data with unlimited voice across India.",
    category: "popular",
    tag: "Best value",
  },
  {
    id: "pop-599",
    amount: 599,
    data: "2 GB/day",
    validity: "28 days",
    description: "Extra daily data with unlimited voice across India.",
    category: "popular",
    tag: "Best value",
  },
  {
    id: "pop-719",
    amount: 719,
    data: "1.5 GB/day",
    validity: "84 days",
    description: "Long-validity pack with unlimited calls and SMS.",
    category: "popular",
  },
  {
    id: "unl-349",
    amount: 349,
    data: "2.5 GB/day",
    validity: "28 days",
    description: "Truly unlimited voice with a generous daily data bucket.",
    category: "unlimited",
    tag: "Unlimited",
  },
  {
    id: "unl-666",
    amount: 666,
    data: "1.5 GB/day",
    validity: "56 days",
    description: "Two-month unlimited calling with steady daily data.",
    category: "unlimited",
  },
  {
    id: "unl-2999",
    amount: 2999,
    data: "2.5 GB/day",
    validity: "365 days",
    description: "Annual unlimited plan with year-long peace of mind.",
    category: "unlimited",
    tag: "Annual",
  },
  {
    id: "data-15",
    amount: 15,
    data: "1 GB",
    validity: "1 day",
    description: "Quick top-up for a short data boost.",
    category: "data",
  },
  {
    id: "data-61",
    amount: 61,
    data: "6 GB",
    validity: "7 days",
    description: "Weekend binge pack for streaming and downloads.",
    category: "data",
  },
  {
    id: "data-181",
    amount: 181,
    data: "30 GB",
    validity: "30 days",
    description: "Monthly data add-on without changing your base plan.",
    category: "data",
    tag: "Add-on",
  },
  {
    id: "tt-10",
    amount: 10,
    data: "—",
    validity: "Lifetime",
    description: "₹7.47 talktime after GST. No validity limit.",
    category: "talktime",
  },
  {
    id: "tt-50",
    amount: 50,
    data: "—",
    validity: "Lifetime",
    description: "₹39.37 talktime after GST for local and STD calls.",
    category: "talktime",
  },
  {
    id: "tt-100",
    amount: 100,
    data: "—",
    validity: "Lifetime",
    description: "₹81.75 talktime after GST. Instant wallet credit.",
    category: "talktime",
  },
  {
    id: "isd-18",
    amount: 18,
    data: "—",
    validity: "28 days",
    description: "ISD calling rates for USA, Canada, and UK.",
    category: "isd",
  },
  {
    id: "isd-49",
    amount: 49,
    data: "—",
    validity: "28 days",
    description: "Broader ISD pack covering Middle East destinations.",
    category: "isd",
  },
];

export function getPlansByCategory(category: PlanCategoryId): PrepaidPlan[] {
  return prepaidPlans.filter((plan) => plan.category === category);
}

export function findPlanByAmount(amount: number): PrepaidPlan | undefined {
  return prepaidPlans.find((plan) => plan.amount === amount);
}
