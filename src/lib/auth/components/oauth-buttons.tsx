"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/google";
import { MicrosoftIcon } from "@/components/icons/microsoft";
import { AppleIcon } from "@/components/icons/apple";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuthContextValue } from "../provider";

interface OAuthButtonsProps {
  loading?: boolean;
  className?: string;
  showSeparator?: boolean;
}

export function OAuthButtons({
  loading = false,
  className,
  showSeparator = true,
}: OAuthButtonsProps) {
  const t = useTranslations("auth");
  const auth = useAuthContextValue();
  const onOAuth = async (provider: "google" | "azure" | "apple") => {
    try {
      await auth.signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="h-11"
          onClick={() => onOAuth("google")}
          disabled={loading}
          type="button"
        >
          <span className="sr-only">{t("oauth.google")}</span>
          <GoogleIcon />
        </Button>
        <Button
          variant="outline"
          className="h-11"
          onClick={() => onOAuth("azure")}
          disabled={loading}
          type="button"
        >
          <MicrosoftIcon />
          <span className="sr-only">{t("oauth.microsoft")}</span>
        </Button>
        <Button
          variant="outline"
          className="h-11"
          onClick={() => onOAuth("apple")}
          disabled={loading}
          type="button"
        >
          <AppleIcon />
          <span className="sr-only">{t("oauth.apple")}</span>
        </Button>
      </div>

      {showSeparator && (
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t("orContinueWith")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
