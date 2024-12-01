import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import * as Notifications from "expo-notifications";
import { useEffect, useLayoutEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

import "./../styles/nativewind.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WaterProvider } from "@/context/WaterContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Appearance } from "react-native";

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useLayoutEffect(() => {
    Appearance.setColorScheme("dark");
  }, []);

  useEffect(() => {
    async function requestNotificationPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    }

    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />

        <GestureHandlerRootView>
          <WaterProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </WaterProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
