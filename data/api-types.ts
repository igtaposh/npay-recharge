export type Account = {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  pan?: string;
  aadhaar?: string;
  has_mpin: boolean;
  is_phone_verified: boolean;
  is_email_verified: boolean;
};
export type ApiTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  created_at: string;
  status: "Successful" | "Pending" | "Failed";
  category: "recharge" | "wallet" | "google-play";
  service: "prepaid" | "dth" | "google-play" | "wallet";
  provider?: string;
  provider_message?: string;
  checkout?: {
    provider: "smepay";
    environment: "test" | "live";
    payment_link: string | null;
    qr_code: string | null;
    intents: Record<string, string>;
    expires_at: string | null;
    payment_status: string;
  };
  recipient?: string | null;
  plan_snapshot?: { data_allowance?: string; validity?: string; name?: string };
};
export type Session = {
  access_token: string;
  refresh_token: string;
  account?: Account;
};
export type Challenge = {
  challenge_id: string;
  expires_in: number;
  demo?: boolean;
  demo_otp?: string;
};
export type AppConfig = {
  demo: boolean;
  mock_recharge: boolean;
  mock_payment: boolean;
  mock_otp: boolean;
  recharge_provider?: "demo" | "manual" | "mrobotics";
  payment_gateway?: "demo" | "manual" | "smepay";
};
export type RechargeRequest = {
  service: "prepaid" | "dth" | "google-play";
  amount: string;
  mpin: string;
  operator: string;
  circle?: string;
  plan_code?: string;
  recipient?: string;
  operator_id?: string;
  circle_id?: string;
  plan_id?: string;
};

export type ApiOperator = { id:string; code:string; name:string; service:string; account_digits:number; min_amount:string; max_amount:string };
export type ApiCircle = { id:string; code:string; name:string };
export type ApiPlan = { id:string; code:string; name:string; amount:string; category:string; data_allowance:string | null; validity:string | null; description:string | null; tag:string | null };
