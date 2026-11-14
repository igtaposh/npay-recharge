import { Redirect } from "expo-router";
import { useRecharge } from "../components/recharge-context";
export default function Index() { const { account } = useRecharge(); return <Redirect href={account ? "/(tabs)" : "/(auth)/login"} />; }
