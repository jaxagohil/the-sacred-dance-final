import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import {
  Stack,
} from "expo-router";

import {
  StatusBar,
} from "expo-status-bar";

import "react-native-reanimated";

import {
  useEffect,
} from "react";

import {
  useColorScheme,
} from "@/hooks/use-color-scheme";

import {
  loadValidSignals,
} from "../lib/loadValidSignals";

export const unstable_settings = {
  anchor: "(tabs)",
};

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  useFonts,
} from "@expo-google-fonts/inter";

import {
  CormorantGaramond_300Light_Italic,
} from "@expo-google-fonts/cormorant-garamond";


export default function RootLayout() {

  const colorScheme =
    useColorScheme();

  // ✨ preload signals

  useEffect(() => {

    loadValidSignals();

  }, []);

  const [fontsLoaded] =
  useFonts({

    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    CormorantGaramond_300Light_Italic,
  });

if (!fontsLoaded) {

  return null;
}

  return (

    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >

      <Stack

        screenOptions={{

          headerShown: false,

          // ✨ sacred transitions

          animation:
            "fade",

          contentStyle: {
            backgroundColor:
              "#020304",
          },
        }}
      >

        <Stack.Screen
          name="(tabs)"
        />

        <Stack.Screen
          name="modal"

          options={{
            presentation:
              "transparentModal",

            animation:
              "fade",
          }}
        />

      </Stack>

      <StatusBar
        style="light"
      />

    </ThemeProvider>
  );
}