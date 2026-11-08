import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <Link href="/" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Home" className="active:opacity-70">
          <Logo height={20} />
        </Pressable>
      </Link>
      <ThemeToggle />
    </View>
  );
}
