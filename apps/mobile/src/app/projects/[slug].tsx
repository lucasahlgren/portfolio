import { categoryLabel, projectQuery, type Project } from "@portfolio/content";
import { useLocalSearchParams } from "expo-router";
import { SearchX } from "lucide-react-native";
import { useWindowDimensions, View } from "react-native";

import { Badges } from "@/components/badges";
import { LinkButton } from "@/components/link-button";
import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { Eyebrow, Screen } from "@/components/screen";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSanityQuery } from "@/hooks/use-sanity-query";
import { useTheme } from "@/hooks/use-theme";
import { categoryIcons } from "@/lib/category-icons";
import { siteUrl } from "@/lib/sanity";

export default function ProjectScreen() {
  const theme = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 672) - 48;
  const {
    data: project,
    loading,
    error,
    refreshing,
    refresh,
  } = useSanityQuery<Project>(projectQuery, { slug });

  if (!project) {
    return (
      <Screen hasHeader loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
        <Alert icon={SearchX}>
          <AlertTitle>Project not found</AlertTitle>
        </Alert>
      </Screen>
    );
  }

  return (
    <Screen hasHeader refreshing={refreshing} onRefresh={refresh}>
      <View className="gap-6">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            {project.category && (
              <Icon
                as={categoryIcons[project.category]}
                size={14}
                color={project.accentColor ?? theme.brand}
              />
            )}
            <Eyebrow>
              {[categoryLabel(project.category), project.year].filter(Boolean).join(" · ")}
            </Eyebrow>
          </View>
          <Text className="text-3xl font-semibold tracking-tight">{project.title}</Text>
          {project.excerpt && (
            <Text className="text-[17px] leading-7 text-muted-foreground">{project.excerpt}</Text>
          )}
        </View>

        <View className="overflow-hidden rounded-2xl">
          <AspectRatio ratio={4 / 3}>
            <SanityImage
              image={project.coverImage}
              width={contentWidth}
              className="h-full w-full bg-muted"
            />
          </AspectRatio>
        </View>

        <PortableText value={project.body} />

        <Card className="rounded-2xl">
          <CardContent className="gap-5">
            {project.role && (
              <View className="gap-1">
                <Eyebrow>Role</Eyebrow>
                <Text>{project.role}</Text>
              </View>
            )}
            {project.tools && project.tools.length > 0 && (
              <View>
                <Eyebrow>Tools</Eyebrow>
                <Badges items={project.tools} />
              </View>
            )}
            {project.team && project.team.length > 0 && (
              <>
                <Separator />
                <View className="gap-1">
                  <Eyebrow>Team</Eyebrow>
                  <Text className="text-muted-foreground">{project.team.join(", ")}</Text>
                </View>
              </>
            )}
          </CardContent>
        </Card>

        {project.gallery?.map((image, i) => (
          <SanityImage
            key={image.asset?._ref ?? i}
            image={image}
            width={contentWidth}
            className="w-full rounded-2xl bg-muted"
          />
        ))}

        <View className="gap-3">
          {project.videoUrl && <LinkButton label="Watch video" url={project.videoUrl} />}
          {project.links?.map((link) => (
            <LinkButton key={link._key} label={link.label} url={link.url} />
          ))}
          <LinkButton label="View on web" url={`${siteUrl}/projects/${project.slug}`} />
        </View>
      </View>
    </Screen>
  );
}
