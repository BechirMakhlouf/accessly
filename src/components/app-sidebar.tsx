import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./sidebar/team-switcher"
import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react"
import { NavTeam } from "./sidebar/nav-team"

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

const team = [
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
export function AppSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavTeam team={team} />
        hello
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
