import { Monitor, Moon, Sun } from "lucide-react-native";
import { Pressable } from "react-native";

import { useThemePreference, type ThemePreference } from "@/components/theme-preference";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const next: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const icons = { light: Sun, dark: Moon, system: Monitor } as const;
const labels = { light: "Light", dark: "Dark", system: "System" } as const;

export function ThemeToggle({ plain = false }: { plain?: boolean }) {
  const { preference, setPreference } = useThemePreference();
  const label = `Theme: ${labels[preference]}. Tap to switch to ${labels[next[preference]]}.`;
  const toggle = () => setPreference(next[preference]);

  if (plain) {
    return (
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={8}
        className="size-9 items-center justify-center active:opacity-60"
      >
        <Icon as={icons[preference]} size={20} />
      </Pressable>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onPress={toggle}
      accessibilityLabel={label}
    >
      <Icon as={icons[preference]} size={18} />
    </Button>
  );
}
