import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPublicInviteById, updateUserOwnInvite } from "@/modules/organizations/actions";
import { isAuthenticated, getUserEmail, signOut } from "@/lib/auth/actions";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InvitePageProps {
    params: Promise<{
        inviteId: string;
        locale: string;
    }>;
    searchParams: Promise<{
        action?: "accept" | "decline";
    }>;
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
    const { inviteId } = await params;
    const { action } = await searchParams;
    const t = await getTranslations("invitePage");

    // Check if user is authenticated
    const isUserAuthenticated = await isAuthenticated();

    // Get invite details
    const inviteResult = await getPublicInviteById(inviteId);

    // Check for email mismatch if user is authenticated
    if (isUserAuthenticated && inviteResult.data) {
        const currentUserEmailResult = await getUserEmail();
        const currentUserEmail = currentUserEmailResult.data;
        const invitedEmail = inviteResult.data.email;

        if (currentUserEmail && currentUserEmail !== invitedEmail) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md w-full mx-auto p-6">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>{t("emailMismatch.title")}</CardTitle>
                                <CardDescription>
                                    {t("emailMismatch.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {t("emailMismatch.invitedEmail", { invitedEmail })}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {t("emailMismatch.currentEmail", { currentEmail: currentUserEmail })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <form action={signOut} className="flex-1">
                                        <Button type="submit" variant="outline" className="w-full">
                                            {t("emailMismatch.signOutAndLogin")}
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }
    }

    if (inviteResult.error) {
        if (inviteResult.error === "org.invite.notFound") {
            notFound();
        }
        // For other errors, we'll show a generic error
    }

    const invite = inviteResult.data;

    // Check if invite is expired or revoked
    if (invite) {
        const now = new Date();
        const expiresAt = new Date(invite.expires_at);

        if (now > expiresAt) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md w-full mx-auto p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                {t("expired.title")}
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                {t("expired.description")}
                            </p>
                            <a
                                href={routes.landingPage}
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                {t("expired.backToHome")}
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        if (invite.status === "revoked") {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md w-full mx-auto p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                {t("revoked.title")}
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                {t("revoked.description")}
                            </p>
                            <a
                                href={routes.landingPage}
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                {t("revoked.backToHome")}
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // Handle accept/decline actions if user is authenticated
    if (isUserAuthenticated && action && invite) {
        if (action === "accept") {
            const result = await updateUserOwnInvite(inviteId, "accepted");
            if (result.error) {
                // Show error state
                return (
                    <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="max-w-md w-full mx-auto p-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle>{t("inviteDetails.title", { organizationName: invite.organization.name })}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {t("inviteDetails.error.acceptFailed")}
                                        </AlertDescription>
                                    </Alert>
                                    <div className="mt-4 flex gap-2">
                                        <Button asChild className="flex-1">
                                            <a href={`?`}>Try Again</a>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1">
                                            <a href={routes.landingPage}>Back to Home</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            } else {
                // Success - redirect to dashboard
                redirect(routes.protected.dashboard.root);
            }
        } else if (action === "decline") {
            const result = await updateUserOwnInvite(inviteId, "rejected");
            if (result.error) {
                // Show error state
                return (
                    <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="max-w-md w-full mx-auto p-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle>{t("inviteDetails.title", { organizationName: invite.organization.name })}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {t("inviteDetails.error.declineFailed")}
                                        </AlertDescription>
                                    </Alert>
                                    <div className="mt-4 flex gap-2">
                                        <Button asChild className="flex-1">
                                            <a href={`?`}>Try Again</a>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1">
                                            <a href={routes.landingPage}>Back to Home</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            } else {
                // Success - redirect to home
                redirect(routes.landingPage);
            }
        }
    }

    if (!invite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {t("notFound.title")}
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            {t("notFound.description")}
                        </p>
                        <a
                            href={routes.landingPage}
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            {t("notFound.backToHome")}
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleDisplayName = (role: string) => {
        return role === "admin" ? "Admin" : "Member";
    };

    if (!isUserAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-auto p-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>{t("loginRequired.title")}</CardTitle>
                            <CardDescription>
                                {t("loginRequired.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    {t("loginRequired.invitedEmail", { email: invite.email })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild className="flex-1">
                                    <a href={routes.auth.signIn}>
                                        {t("loginRequired.loginButton")}
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="flex-1">
                                    <a href={routes.auth.signUp}>
                                        {t("loginRequired.signUpButton")}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>
                            {t("inviteDetails.title", { organizationName: invite.organization.name })}
                        </CardTitle>
                        <CardDescription>
                            {t("inviteDetails.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    {t("inviteDetails.invitedBy", { inviterName: invite.inviterProfile?.full_name || "Unknown" })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    {t("inviteDetails.role", { role: getRoleDisplayName(invite.role) })}
                                </span>
                                <Badge variant="secondary">
                                    {getRoleDisplayName(invite.role)}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    {t("inviteDetails.expiresAt", { expiresAt: formatDate(invite.expires_at) })}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button asChild className="flex-1">
                                <a href={`?action=accept`}>
                                    {t("inviteDetails.acceptButton")}
                                </a>
                            </Button>
                            <Button asChild variant="outline" className="flex-1">
                                <a href={`?action=decline`}>
                                    {t("inviteDetails.declineButton")}
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}