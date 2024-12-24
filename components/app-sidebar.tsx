import logo from "@/app/images/logo.png"

import * as React from "react"
import Image from "next/image"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "dashboard"
    },
    {
      title: "Profile",
      url: "#"
    },
    {
      title: "Leaderboards",
      url: "#",
      items: [
        {
          title: "Frauds",
          url: "#",
        },
        {
          title: "Chads",
          url: "#",
        },
      ],
    },
    {
      title: "FENJ",
      url: "#",
      items: [
        {
          title: "Matches",
          url: "#",
        },
        {
          title: "Players",
          url: "#",
          isActive: true,
        },
        {
          title: "Fields",
          url: "#",
        }
      ],
    },
    {
      title: "Gaming",
      url: "#",
      items: [
        {
          title: "Games",
          url: "#",
        },
        {
          title: "Endorsements",
          url: "#",
        }
      ],
    },
    {
      title: "Lore",
      url: "#",
      items: [
        {
          title: "Users",
          url: "#",
        },
        {
          title: "Events",
          url: "#",
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={logo}
                    width={500}
                    height={500}
                    alt="Nakama Org logo"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Circus</span>
                  <span className="">v0.0.1</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
