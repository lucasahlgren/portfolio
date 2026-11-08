import {
  categoryLabel,
  projectsQuery,
  type ProjectCard as ProjectCardType,
} from "@portfolio/content";
import { FolderOpen } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { ProjectCard } from "@/components/project-card";
import { Eyebrow, Screen } from "@/components/screen";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSanityQuery } from "@/hooks/use-sanity-query";

export default function ProjectsScreen() {
  const [category, setCategory] = useState("all");
  const { data, loading, error, refreshing, refresh } =
    useSanityQuery<ProjectCardType[]>(projectsQuery);

  const projects = data ?? [];
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[];
  const visible = category === "all" ? projects : projects.filter((p) => p.category === category);

  return (
    <Screen hasHeader loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      {projects.length === 0 ? (
        <Alert icon={FolderOpen}>
          <AlertTitle>No projects posted yet</AlertTitle>
        </Alert>
      ) : (
        <>
          {categories.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6 mb-6"
              contentContainerClassName="px-6"
            >
              <ToggleGroup
                type="single"
                variant="outline"
                value={category}
                onValueChange={(value) => value && setCategory(value)}
              >
                <ToggleGroupItem value="all" isFirst aria-label="All">
                  <Text>All</Text>
                </ToggleGroupItem>
                {categories.map((value, i) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    isLast={i === categories.length - 1}
                    aria-label={categoryLabel(value) ?? value}
                  >
                    <Text>{categoryLabel(value)}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </ScrollView>
          )}
          {[
            { title: "School projects", items: visible.filter((p) => p.kind !== "personal") },
            { title: "Spare time projects", items: visible.filter((p) => p.kind === "personal") },
          ]
            .filter((group) => group.items.length > 0)
            .map((group, i) => (
              <View key={group.title} className={i > 0 ? "mt-12 gap-6" : "gap-6"}>
                <Eyebrow>{group.title}</Eyebrow>
                {group.items.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </View>
            ))}
        </>
      )}
    </Screen>
  );
}
