import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme as nativewindColorScheme, useColorScheme } from "nativewind";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { THEME } from "@/lib/theme";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";
const DEFAULT_PREFERENCE: ThemePreference = "dark";

nativewindColorScheme.set(DEFAULT_PREFERENCE);
const FADE_MS = 320;

const ThemePreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
}>({ preference: DEFAULT_PREFERENCE, setPreference: () => {} });

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(DEFAULT_PREFERENCE);
  const overlayOpacity = useSharedValue(0);
  const overlayColor = useSharedValue<string>(THEME.light.background);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
          setColorScheme(stored);
        }
      })
      .catch(() => {});
  }, [setColorScheme]);

  const setPreference = (value: ThemePreference) => {
    overlayColor.value = THEME[colorScheme === "dark" ? "dark" : "light"].background;
    overlayOpacity.value = 1;
    setPreferenceState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});

    requestAnimationFrame(() => {
      setColorScheme(value);
      requestAnimationFrame(() => {
        overlayOpacity.value = withDelay(
          60,
          withTiming(0, { duration: FADE_MS, easing: Easing.out(Easing.cubic) }),
        );
      });
    });
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    backgroundColor: overlayColor.value,
  }));

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      <View style={styles.root}>
        {children}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, overlayStyle]} />
      </View>
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemePreferenceContext);
}

const styles = StyleSheet.create({ root: { flex: 1 } });
