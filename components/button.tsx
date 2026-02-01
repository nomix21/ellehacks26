import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RootStackParamList = {
  insights: undefined;
};

type Props = {
  label: string;
};

export default function Button({ label }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("insights")} // CHANGE TARGET TO: journal
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 48,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#ff8fb1",
    width: "100%", // <- fill the container width
    height: "100%", // <- optional, fill container height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    justifyContent: "center",
  },
});
