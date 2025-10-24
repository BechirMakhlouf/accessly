import { getTranslations } from "next-intl/server";
import { getUserInvitesWithOrganizations } from "@/modules/organizations/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, AlertCircle } from "lucide-react";
import { InviteCard } from "@/components/invite-card";

export default async function InvitesPage() {
  const t = await getTranslations("org.invitesPage");

  // Fetch invites with organization details server-side
  const result = await getUserInvitesWithOrganizations();


  if (result.error) {
    return (
      <div className="flex justify-center">
        <div className="min-h-screen bg-background">
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {result.error}
                </AlertDescription>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const invites = result.data || [];

  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full xl:w-3/4 mx-12">
        <div className="min-h-screen bg-background w-full">
          <main className="container py-8 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
              </div>

              {invites.length === 0 ? (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("noInvites")}</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {t("noInvitesDescription")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {invites.map((invite) => (
                    <InviteCard key={invite.id} inviteId={invite.id} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

