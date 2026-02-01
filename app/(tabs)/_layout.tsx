import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.darkBackground}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#CC6692",
          tabBarInactiveTintColor: "#1b1b1b",
          headerStyle: { backgroundColor: "#1b1b1b" },
          headerShadowVisible: true,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#fff",
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 2,
            borderRadius: 40,
            height: 40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
          tabBarShowLabel: false,
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="GirlMath"
          options={{
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
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused ? "person-circle-outline" : "person-circle-outline"
                }
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "mail-outline" : "mail-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  darkBackground: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
});
