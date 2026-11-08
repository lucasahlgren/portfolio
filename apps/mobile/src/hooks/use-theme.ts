import { useColorScheme } from "nativewind";

import { THEME } from "@/lib/theme";

export function useTheme() {
  const { colorScheme } = useColorScheme();
  return THEME[colorScheme === "dark" ? "dark" : "light"];
}
