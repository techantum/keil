import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Gauge,
  HardHat,
  Headphones,
  Heart,
  Leaf,
  MapPin,
  Medal,
  Network,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Target,
  Thermometer,
  Trophy,
  Truck,
  UserCog,
  Users,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  settings: Settings,
  workflow: Workflow,
  gauge: Gauge,
  "map-pin": MapPin,
  calendar: Calendar,
  building: Building2,
  target: Target,
  sliders: SlidersHorizontal,
  "shield-check": ShieldCheck,
  thermometer: Thermometer,
  headphones: Headphones,
  truck: Truck,
  leaf: Leaf,
  "user-cog": UserCog,
  "hard-hat": HardHat,
  trophy: Trophy,
  award: Award,
  star: Star,
  medal: Medal,
  network: Network,
  users: Users,
  "badge-check": BadgeCheck,
  zap: Zap,
  wrench: Wrench,
  heart: Heart,
};

export function KeilIcon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] || Settings;
  return <Icon className={className} aria-hidden="true" />;
}
