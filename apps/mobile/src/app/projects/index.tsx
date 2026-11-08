import {
  categoryLabel,
  projectsQuery,
  type ProjectCard as ProjectCardType,
} from "@portfolio/content";
import { useFocusEffect } from "expo-router";
import { FolderOpen } from "lucide-react-native";
import { useCallback, useState } from "react";
import { View } from "react-native";

import { FilterPills } from "@/components/filter-pills";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Screen } from "@/components/screen";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useSanityQuery } from "@/hooks/use-sanity-query";

export default function ProjectsScreen() {
  const [category, setCategory] = useState("all");
  const [visit, setVisit] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setVisit((v) => v + 1);
    }, []),
  );
  const { data, loading, error, refreshing, refresh } =
    useSanityQuery<ProjectCardType[]>(projectsQuery);

  const projects = data ?? [];
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[];
  const visible = category === "all" ? projects : projects.filter((p) => p.category === category);

  return (
    <Screen loading={loading} error={error} refreshing={refreshing} onRefresh={refresh}>
      <PageHeader
        eyebrow={`Projects · ${String(projects.length).padStart(2, "0")}`}
        title="Things I’ve *made*"
      >
        Projects from my studies in media technology at KTH and from my spare time, from data
        visualisation and web apps to games, AR, design and motion.
      </PageHeader>
      {projects.length === 0 ? (
        <Alert icon={FolderOpen}>
          <AlertTitle>No projects posted yet</AlertTitle>
        </Alert>
      ) : (
        <>
          {categories.length > 1 && (
            <FilterPills
              value={category}
              onChange={setCategory}
              options={[
                { value: "all", label: "All", count: projects.length },
                ...categories.map((value) => ({
                  value,
                  label: categoryLabel(value) ?? value,
                  count: projects.filter((p) => p.category === value).length,
                })),
              ]}
            />
          )}
          {[
            { title: "School projects", items: visible.filter((p) => p.kind !== "personal") },
            { title: "Spare time projects", items: visible.filter((p) => p.kind === "personal") },
          ]
            .filter((group) => group.items.length > 0)
            .map((group, i) => (
              <View key={group.title} className={i > 0 ? "mt-12 gap-6" : "gap-6"}>
                <Eyebrow>{group.title}</Eyebrow>
                {group.items.map((project, index) => (
                  <Reveal key={`${visit}-${category}-${project._id}`} index={index}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </View>
            ))}
        </>
      )}
    </Screen>
  );
}
