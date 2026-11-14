import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { api, errorMessage } from "../data/api";
import type { ApiOperator } from "../data/api-types";
import { Button, Card, Field, Page, PageHeading } from "./ui";
import { useRecharge } from "./recharge-context";

export function DthDirectRecharge() {
  const router = useRouter();
  const params = useLocalSearchParams<{operator?:string;subscriber?:string}>();
  const { balance } = useRecharge();
  const [operators,setOperators]=useState<ApiOperator[]>([]);
  const [code,setCode]=useState(params.operator || "tata-play");
  const [subscriber,setSubscriber]=useState(params.subscriber || "");
  const [amount,setAmount]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    let active=true;
    void api.request<ApiOperator[]>("operators?service=dth").then(result=>{if(active)setOperators(result.data);}).catch(error=>{if(active)setError(errorMessage(error));}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[retry]);
  function proceed() {
    const operator=operators.find(item=>item.code===code); const value=Number(amount);
    if(!operator || !new RegExp(`^[0-9]{${operator.account_digits}}$`).test(subscriber)){setError("Select an operator and enter the correct subscriber ID.");return;}
    if(!Number.isInteger(value) || value<Number(operator.min_amount) || value>Math.min(25000,Number(operator.max_amount))){setError("Enter a whole-rupee amount within the operator's allowed range.");return;}
    if(value>balance){setError("Wallet balance is too low. Add balance to continue.");return;}
    router.push({pathname:"/recharge/confirm",params:{service:"dth",operator:operator.code,operatorName:operator.name,subscriber,amount:String(value)}});
  }
  return <Page>
    <PageHeading eyebrow="DTH RECHARGE" title="Recharge your DTH" subtitle="Double-check the subscriber ID and amount before confirming." />
    <Card className="gap-3">
      {loading ? <Text className="text-muted">Loading operators…</Text> : null}
      {operators.map(operator=><Pressable key={operator.id} accessibilityRole="button" accessibilityState={{selected:code===operator.code}} onPress={()=>{setCode(operator.code);setSubscriber("");setError("");}} className={`rounded-xl border p-3 ${code===operator.code?"border-green bg-green-light":"border-line"}`}><Text className="text-sm font-bold text-ink">{operator.name}</Text></Pressable>)}
    </Card>
    <Field maxLength={11} placeholder="Subscriber ID" keyboardType="numeric" value={subscriber} onChangeText={value=>setSubscriber(value.replace(/\D/g,"").slice(0,11))} />
    <Field maxLength={5} placeholder="Amount in ₹" keyboardType="numeric" value={amount} onChangeText={value=>setAmount(value.replace(/\D/g,"").slice(0,5))} />
    {error ? <Text className="text-danger">{error}</Text> : null}
    {!loading && !operators.length ? <Button label="Retry loading operators" onPress={()=>{setLoading(true);setError("");setRetry(value=>value+1);}} /> : null}
    <Button disabled={loading || !operators.length} label="Continue" onPress={proceed} />
  </Page>;
}
