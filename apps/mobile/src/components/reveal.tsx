import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { Easing, FadeInDown, ReduceMotion } from "react-native-reanimated";

export function Reveal({
  index = 0,
  delay,
  duration = 600,
  className,
  style,
  pointerEvents,
  children,
}: {
  index?: number;
  delay?: number;
  duration?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: "none" | "auto";
  children: ReactNode;
}) {
  return (
    <Animated.View
      className={className}
      style={style}
      pointerEvents={pointerEvents}
      entering={FadeInDown.delay(delay ?? index * 120)
        .duration(duration)
        .easing(Easing.out(Easing.cubic))
        .reduceMotion(ReduceMotion.System)}
    >
      {children}
    </Animated.View>
  );
}
