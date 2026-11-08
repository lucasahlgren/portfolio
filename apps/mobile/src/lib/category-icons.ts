import type { ProjectCategory } from "@portfolio/content";
import {
  ChartNoAxesCombined,
  Clapperboard,
  FlaskConical,
  Gamepad2,
  Glasses,
  Globe,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react-native";

export const categoryIcons: Record<ProjectCategory, LucideIcon> = {
  web: Globe,
  mobile: Smartphone,
  dataviz: ChartNoAxesCombined,
  design: PenTool,
  motion: Clapperboard,
  game: Gamepad2,
  xr: Glasses,
  research: FlaskConical,
};
