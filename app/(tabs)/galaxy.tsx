import { StyleSheet, Text, View } from "react-native";
import Svg, { Ellipse, Defs, LinearGradient, Stop, ClipPath, Image as SvgImage } from "react-native-svg";

export default function GalaxyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Galaxy</Text>

      <Svg width={280} height={420}>
        <Defs>
          {/* Gradient for ellipse border */}
          <LinearGradient
            id="ellipseGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#fff" />
            <Stop offset="25%" stopColor="#a695d5" />
            <Stop offset="50%" stopColor="#e07aa6" />
            <Stop offset="75%" stopColor="#ffb347" />
            <Stop offset="100%" stopColor="#fff" />
          </LinearGradient>

          {/* Clip path for ellipse */}
          <ClipPath id="ellipseClip">
            <Ellipse cx="140" cy="210" rx="130" ry="200" />
          </ClipPath>
        </Defs>

        {/* Image clipped to ellipse */}
        <SvgImage
          href={require("../../assets/images/stars.png")} // path relative to this file
          width={280}
          height={420}
          clipPath="url(#ellipseClip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Ellipse border with gradient */}
        <Ellipse
          cx="140"
          cy="210"
          rx="130"
          ry="200"
          fill="transparent"
          stroke="url(#ellipseGradient)"
          strokeWidth="2"
        />
      </Svg>

      <Text style={styles.quote}>
        Way to go! You've added 2 new stars this week!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    paddingTop: 64,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    marginBottom: 16,
    fontFamily: "Brawler",
  },
  quote: {
    color: "#bdbdbd",
    fontSize: 16,
    marginTop: 32,
    fontStyle: "italic",
    textAlign: "center",
    maxWidth: 250,
  },
});
