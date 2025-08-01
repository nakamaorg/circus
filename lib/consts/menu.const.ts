import type { LucideIcon } from "lucide-react";
import { Home, User } from "lucide-react";



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
    icon: User,
    label: "Profile",
    link: "/profile",
  },
];
