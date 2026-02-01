import { Stack } from "expo-router";
//import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "./context/SessionContext";

export default function RootLayout() {
  return (
    <>
      {/*<Stack>*/}
      {/*  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
      {/*</Stack>*/}
      {/*<StatusBar style="dark" />*/}
         <SessionProvider>
      <Stack />
    </SessionProvider>
    </>
  );
}

