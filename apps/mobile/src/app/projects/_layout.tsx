import { Stack } from "expo-router";
import { Platform } from "react-native";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";

export default function ProjectsLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Projects", headerShown: false }} />
      <Stack.Screen
        name="[slug]"
        options={{
          title: "",
          headerTitleAlign: "center",
          headerTitle: () => <Logo height={18} />,
          headerRight: () => <ThemeToggle plain={Platform.OS === "ios"} />,
        }}
      />
    </Stack>
  );
}
