import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/tabs"
import { TeamMembers } from "@/modules/teams/components/teams-members"
import { TeamSettings } from "@/modules/teams/components/teams-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Team Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="general">Settings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContents transition={{ duration: 0 }}>
          <TabsContent value="general">
            <TeamSettings />
          </TabsContent>
          <TabsContent value="members">
            <TeamMembers />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}
