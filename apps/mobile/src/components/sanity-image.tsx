import type { SanityImage as SanityImageType } from "@portfolio/content";
import { Image, type ImageStyle } from "expo-image";
import { cssInterop } from "nativewind";
import { PixelRatio, type StyleProp } from "react-native";

import { imageUrl } from "@/lib/sanity";

cssInterop(Image, { className: "style" });

type Props = {
  image: SanityImageType | null | undefined;
  width: number;
  className?: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain";
  contentPosition?: "center" | "top";
};

export function SanityImage({
  image,
  width,
  className,
  style,
  contentFit = "cover",
  contentPosition = "center",
}: Props) {
  const uri = imageUrl(image, PixelRatio.getPixelSizeForLayoutSize(width));
  const aspectRatio = image?.dimensions?.aspectRatio;

  return (
    <Image
      source={uri ? { uri } : null}
      placeholder={image?.lqip ? { uri: image.lqip } : null}
      accessibilityLabel={image?.alt || undefined}
      contentFit={contentFit}
      contentPosition={contentPosition}
      transition={250}
      className={className}
      style={[{ aspectRatio }, style]}
    />
  );
}
