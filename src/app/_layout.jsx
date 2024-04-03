import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{title: "Scoreboard Tracker", headerBackVisible: false}} />
    <Stack.Screen name="statistics" options={{title: "Statistics"}} />
    <Stack.Screen name="match/[id]" options={{title: "Match details"}} />
    <Stack.Screen name="matches" options={{title: "Matches"}} />
    <Stack.Screen name="add-match" options={{title: "New match", headerBackVisible: true, headerBackButtonMenuEnabled: true}} />
  </Stack>;
}
