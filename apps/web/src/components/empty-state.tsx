import { Briefcase, Camera, FolderOpen, GraduationCap, type LucideIcon } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const messages = {
  jobs: { title: "No jobs posted yet", icon: Briefcase },
  education: { title: "No education listed yet", icon: GraduationCap },
  photos: { title: "No photos posted yet", icon: Camera },
  projects: { title: "No projects posted yet", icon: FolderOpen },
} satisfies Record<string, { title: string; icon: LucideIcon }>;

export function EmptyState({ type }: { type: keyof typeof messages }) {
  const { title, icon: Icon } = messages[type];

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
