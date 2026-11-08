import { settingsQuery, type Settings } from "@portfolio/content";
import { useWindowDimensions, View } from "react-native";

import { Badges } from "@/components/badges";
import { LinkButton } from "@/components/link-button";
import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { Eyebrow, Screen, SectionTitle } from "@/components/screen";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useSanityQuery } from "@/hooks/use-sanity-query";

const socialLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  dribbble: "Dribbble",
  youtube: "YouTube",
  "500px": "500px",
  other: "Website",
};

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const {
    data: settings,
    loading,
    error,
    refreshing,
    refresh,
  } = useSanityQuery<Settings>(settingsQuery);
  const contentWidth = Math.min(width, 672) - 48;

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <SectionTitle eyebrow="About" title={`Hello, I’m ${settings?.name?.split(" ")[0] ?? ""}`} />

      {settings?.portrait && (
        <View className="overflow-hidden rounded-3xl">
          <AspectRatio ratio={4 / 5}>
            <SanityImage
              image={settings.portrait}
              width={contentWidth}
              contentPosition="top"
              className="h-full w-full bg-muted"
            />
          </AspectRatio>
        </View>
      )}

      <View className="mt-6">
        <PortableText value={settings?.bio} />
      </View>

      {settings?.skills && settings.skills.length > 0 && (
        <View className="mt-10">
          <Separator className="mb-6" />
          <Eyebrow>Tools & technologies</Eyebrow>
          <Badges items={settings.skills} />
        </View>
      )}

      <View className="mt-10 gap-3">
        {settings?.email && <LinkButton label={settings.email} url={`mailto:${settings.email}`} />}
        {settings?.socials?.map((social) => (
          <LinkButton
            key={social._key}
            label={socialLabels[social.platform] ?? social.platform}
            url={social.url}
          />
        ))}
      </View>
    </Screen>
  );
}
