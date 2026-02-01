import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        headerStyle: { backgroundColor: "#1b1b1b" },
        headerShadowVisible: true,
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#1b1b1b" },
        tabBarInactiveTintColor: "#cccbcb",
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          title: " ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: " ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle-outline" : "person-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="insights"
        options={{
          title: " ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "mail-outline" : "mail-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

    <Tabs.Screen
        name="journal"
        options={{
            title: " ",
            tabBarIcon: ({ color, focused }) => (
                <Ionicons
                    name={focused ? "book" : "book-outline"}
                    color={color}
                    size={24}
                />
            ),
        }}
    />

    </Tabs>
  );
}
