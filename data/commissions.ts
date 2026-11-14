export type CommissionCategory = "Prepaid" | "DTH" | "Gift code";

export type CommissionRate = {
  id: string;
  company: string;
  category: CommissionCategory;
  rate: number;
};

export const commissionRates: CommissionRate[] = [
  { id: "jio", company: "Jio", category: "Prepaid", rate: 2.4 },
  { id: "airtel", company: "Airtel", category: "Prepaid", rate: 2.2 },
  { id: "vi", company: "Vi", category: "Prepaid", rate: 2.6 },
  { id: "bsnl", company: "BSNL", category: "Prepaid", rate: 3.0 },
  { id: "tata-play", company: "Tata Play", category: "DTH", rate: 3.1 },
  { id: "airtel-dth", company: "Airtel DTH", category: "DTH", rate: 3.2 },
  { id: "dishtv", company: "Dish TV", category: "DTH", rate: 3.4 },
  {
    id: "google-play",
    company: "Google Play",
    category: "Gift code",
    rate: 1.8,
  },
];

export function earnPerThousand(rate: number): number {
  return Math.round(rate * 10);
}
