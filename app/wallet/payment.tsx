import { useLocalSearchParams, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Image, Platform, Text } from "react-native";
import { Button, Card, Page, PageHeading } from "../../components/ui";
import { useRecharge } from "../../components/recharge-context";
import { api, errorMessage } from "../../data/api";
import type { ApiTransaction } from "../../data/api-types";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { refreshBalance } = useRecharge();
  const [payment, setPayment] = useState<ApiTransaction | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const inFlight = useRef(false);
  const alive = useRef(true);
  const check = useCallback(async () => {
    if (inFlight.current || !id || !alive.current) return;
    inFlight.current = true; setBusy(true);
    try {
      const result = await api.request<ApiTransaction>(`wallet/topups/${id}/status`, {});
      if (!alive.current) return;
      setPayment(result.data); setError("");
      if (result.data.status === "Successful") await refreshBalance();
    } catch (error) { if (alive.current) setError(errorMessage(error)); }
    finally { inFlight.current = false; if (alive.current) setBusy(false); }
  }, [id, refreshBalance]);
  useEffect(() => {
    alive.current = true;
    void (async () => {
      try {
        const result = await api.request<ApiTransaction>(`wallet/topups/${id}/checkout`);
        if (alive.current) setPayment(result.data);
      } catch (error) { if (alive.current) setError(errorMessage(error)); }
      await check();
    })();
    const subscription = AppState.addEventListener("change", state => { if (state === "active") void check(); });
    return () => { alive.current = false; subscription.remove(); };
  }, [id, check]);
  const checkout = payment?.checkout;
  const expires = checkout?.expires_at ? new Date(checkout.expires_at).getTime() : 0;
  const expired = Boolean(expires && now >= expires) || ["EXPIRED", "FAILED", "TEST_FAILED"].includes(checkout?.payment_status || "");
  const terminal = payment?.status === "Successful" || payment?.status === "Failed";
  useEffect(() => {
    if (terminal) return;
    const clock = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => { if (!expired && AppState.currentState === "active") void check(); }, 10000);
    return () => { clearInterval(clock); clearInterval(poll); };
  }, [check, expired, terminal]);
  async function openPayment() {
    const url = checkout?.payment_link;
    if (!url || !/^(upi|tez|phonepe|paytmmp):\/\//i.test(url)) { setError("No supported UPI link is available. Use the QR code or check payment status."); return; }
    try { await Linking.openURL(url); } catch { setError("Could not open a UPI app. Use the QR code from another device, or install a supported UPI app."); }
  }
  const success = payment?.status === "Successful";
  return <Page>
    <PageHeading eyebrow="YOUR WALLET" title={success ? "Payment successful" : "Complete payment"} subtitle={payment ? `Wallet top-up · ₹${payment.amount}` : "Loading your payment…"} />
    {checkout?.environment === "test" ? <Text className="text-center text-sm text-muted">SMEPay test mode · no real wallet funding</Text> : null}
    <Card className="gap-4">
      <Text className="text-base font-bold text-ink">{success ? "Your wallet has been credited." : terminal ? "Payment failed" : expired ? "Payment link expired" : "Awaiting payment confirmation"}</Text>
      {!terminal && !expired && checkout?.qr_code?.startsWith("data:image/png;base64,") ? <Image source={{ uri: checkout.qr_code }} style={{ width: 240, height: 240, alignSelf: "center" }} accessibilityLabel="UPI payment QR code" /> : null}
      {!terminal && !expired && checkout?.payment_link && Platform.OS !== "web" ? <Button label="Pay using UPI app" onPress={() => { void openPayment(); }} /> : null}
      {!terminal && !expired && expires ? <Text className="text-center text-sm text-muted">Expires in {Math.max(0, Math.ceil((expires - now) / 1000))} seconds</Text> : null}
      {!terminal ? <Text className="text-sm text-muted">If you already paid, check status before creating another payment. Closing this screen does not cancel a bank payment.</Text> : null}
      {checkout?.payment_status ? <Text className="text-xs text-muted">Payment status: {checkout.payment_status}</Text> : null}
    </Card>
    {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    {!terminal ? <Button disabled={busy} label={busy ? "Checking…" : "Check payment status"} onPress={() => { void check(); }} /> : null}
    <Button label="Back to wallet" onPress={() => router.replace("/(tabs)/wallet")} />
  </Page>;
}
