import { Stack } from "expo-router";

import { useTheme } from "@/hooks/use-theme";

export default function WorkLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerShadowVisible: false,
        headerTintColor: theme.foreground,
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Projects" }} />
      <Stack.Screen name="[slug]" options={{ title: "", headerLargeTitle: false }} />
    </Stack>
  );
}
