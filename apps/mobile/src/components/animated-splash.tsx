import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Logo } from "@/components/logo";
import { THEME } from "@/lib/theme";

const LOGO_FADE_IN_MS = 500;
const HOLD_MS = 500;
const SPLASH_FADE_OUT_MS = 450;

export function AnimatedSplash() {
  const [visible, setVisible] = useState(true);
  const logoOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);

  const start = () => {
    SplashScreen.hideAsync().catch(() => {});
    logoOpacity.value = withTiming(1, {
      duration: LOGO_FADE_IN_MS,
      easing: Easing.out(Easing.cubic),
    });
    splashOpacity.value = withDelay(
      LOGO_FADE_IN_MS + HOLD_MS,
      withTiming(
        0,
        { duration: SPLASH_FADE_OUT_MS, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) scheduleOnRN(setVisible, false);
        },
      ),
    );
  };

  const splashStyle = useAnimatedStyle(() => ({ opacity: splashOpacity.value }));
  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={start}
      style={[styles.splash, { backgroundColor: THEME.dark.background }, splashStyle]}
    >
      <Animated.View style={logoStyle}>
        <Logo height={28} color={THEME.dark.foreground} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splash: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});
