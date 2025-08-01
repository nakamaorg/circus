import type { LucideIcon } from "lucide-react";
import { GanttChartSquare, Home, ImageIcon, User } from "lucide-react";



export type TMenuItemType = {
  icon: LucideIcon;
  label: string;
  link: string;
};

export const MENU_ITEMS: Array<TMenuItemType> = [
  {
    icon: Home,
    label: "Home",
    link: "/",
  },
  {
    icon: GanttChartSquare,
    label: "Timeline",
    link: "/timeline",
  },
  {
    icon: ImageIcon,
    label: "Memes",
    link: "/memes",
  },
  {
    icon: User,
    label: "Profile",
    link: "/profile",
  },
];
