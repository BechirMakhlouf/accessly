"use client";
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react"
import { TeamSwitcher } from "./team-switcher"
import { NavTeam } from "./nav-team";

const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
]
const teamInfo = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
]
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <TeamSwitcher teams={teams} />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavTeam team={teamInfo} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: "shadcn",
          email: "m@example.com",
          avatar: "/avatars/shadcn.jpg"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
