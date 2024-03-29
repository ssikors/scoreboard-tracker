import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{title: "Scoreboard Tracker"}} />
    <Stack.Screen name="statistics" options={{title: "Statistics"}} />
  </Stack>;
}
