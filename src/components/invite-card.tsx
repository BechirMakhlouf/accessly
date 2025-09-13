"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Calendar, Mail, AlertCircle, Check, X, ExternalLink } from "lucide-react";
import { useInvite } from "@/modules/organizations";
import { InviteStatus } from "@/modules/organizations/types";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

interface InviteCardProps {
  inviteId: string;
}

export function InviteCard({ inviteId }: InviteCardProps) {
  const t = useTranslations("org.invitesPage.inviteCard");
  const router = useRouter();
  const [status, setStatus] = useState<InviteStatus>("pending");

  const {
    invite,
    organization,
    isLoading,
    error,
    acceptInvite,
    rejectInvite,
    isUpdating
  } = useInvite({ inviteId });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const handleAccept = async () => {
    if (isUpdating || !invite) return;

    try {
      const result = await acceptInvite();
      if (result.error) {
        console.error("Failed to accept invite:", result.error);
        // You might want to show a toast notification here
        return;
      }
      setStatus("accepted");
      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleDecline = async () => {
    if (isUpdating || !invite) return;

    try {
      const result = await rejectInvite();
      if (result.error) {
        console.error("Failed to decline invite:", result.error);
        // You might want to show a toast notification here
        return;
      }
      setStatus("rejected");
      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };

  const handleCardClick = () => {
    if (status === "accepted" && organization?.slug) {
      const orgUrl = routes.protected.dashboard.org.slug.root(organization.slug);
      router.push(orgUrl);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-2 min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Skeleton className="h-5 w-5 flex-shrink-0" />
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Invite details skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 sm:space-y-0 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-4 flex-shrink-0" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-4 flex-shrink-0" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
              <Skeleton className="h-8 w-full sm:w-20" />
              <Skeleton className="h-8 w-full sm:w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error || !invite) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-2 min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Building2 className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Error</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Failed to load invite details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Alert>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="text-sm">
              {error ? "Failed to load invite details" : "Invite not found"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isInviteExpired = isExpired(invite.expires_at);
  const isProcessed = status !== "pending";
  const isAccepted = status === "accepted";
  const isClickable = isAccepted && organization?.slug;

  return (
    <Card
      className={`${isInviteExpired || isProcessed ? "opacity-60" : ""} w-full ${isClickable ? "cursor-pointer hover:shadow-md transition-shadow duration-200" : ""
        }`}
      onClick={isClickable ? handleCardClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-2 min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Building2 className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{organization?.name || "Unknown Organization"}</span>
              {isClickable && (
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              You have been invited to {organization?.name || "this organization"} as a {invite.role}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="">
          {/* Invite details - mobile first layout */}
          <div className="">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 sm:space-y-0">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{t("invitedBy")}:</span>
                <span className="font-medium truncate">
                  {invite.inviterProfile.full_name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{t("expiresAt")}:</span>
                <span className={`font-medium ${isInviteExpired ? "text-destructive" : ""}`}>
                  {formatDate(invite.expires_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!isInviteExpired && !isProcessed && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <X className="h-4 w-4" />
                {isUpdating ? t("declining") : t("decline")}
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Check className="h-4 w-4" />
                {isUpdating ? t("accepting") : t("accept")}
              </Button>
            </div>
          )}

          {/* Status messages */}
          {isInviteExpired && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{t("expired")}</span>
            </div>
          )}

          {/* Status indicator for processed invites */}
          {isProcessed && (
            <div className="flex flex-col items-center sm:items-end space-y-1">
              <Badge variant={status === "accepted" ? "default" : "secondary"}>
                {status === "accepted" ? t("accepted") : t("declined")}
              </Badge>
              {isClickable && (
                <span className="text-xs text-muted-foreground text-center sm:text-right">
                  {t("clickToVisit")}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
