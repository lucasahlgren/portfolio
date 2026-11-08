"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useState, type ComponentProps } from "react";

import { Carousel } from "@/components/ui/carousel";

export function WheelCarousel(props: Omit<ComponentProps<typeof Carousel>, "plugins">) {
  const [plugins] = useState(() => [WheelGesturesPlugin()]);
  return <Carousel {...props} plugins={plugins} />;
}
