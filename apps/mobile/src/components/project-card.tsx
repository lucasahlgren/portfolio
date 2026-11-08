import { categoryLabel, type ProjectCard as ProjectCardType } from "@portfolio/content";
import { Link } from "expo-router";
import { Pressable, useWindowDimensions, View } from "react-native";

import { SanityImage } from "@/components/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { categoryIcons } from "@/lib/category-icons";

const MAX_WIDTH = 672;
const GUTTER = 24;

export function ProjectCard({ project, width }: { project: ProjectCardType; width?: number }) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = width ?? Math.min(screenWidth, MAX_WIDTH) - GUTTER * 2;
  const category = categoryLabel(project.category);
  const CategoryIcon = project.category ? categoryIcons[project.category] : null;

  return (
    <Link href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }} asChild>
      <Pressable style={{ width: cardWidth }} className="active:opacity-80">
        <Card className="gap-0 overflow-hidden rounded-2xl p-0">
          <AspectRatio ratio={4 / 3}>
            <SanityImage
              image={project.coverImage}
              width={cardWidth}
              className="h-full w-full bg-muted"
            />
          </AspectRatio>
          <CardHeader className="gap-1.5 p-4">
            <View className="flex-row flex-wrap items-center gap-1.5">
              {category && CategoryIcon && (
                <Badge variant="outline" className="rounded-full">
                  <Icon as={CategoryIcon} size={12} color={project.accentColor ?? theme.brand} />
                  <Text>{category}</Text>
                </Badge>
              )}
              {project.year && (
                <Badge variant="secondary" className="rounded-full">
                  <Text>{project.year}</Text>
                </Badge>
              )}
            </View>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            {project.subtitle && <CardDescription>{project.subtitle}</CardDescription>}
          </CardHeader>
        </Card>
      </Pressable>
    </Link>
  );
}
