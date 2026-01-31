import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "GirlMath" }} />
      <Tabs.Screen name="summary" options={{ title: "Insights" }} />
    </Tabs>
  );
}
