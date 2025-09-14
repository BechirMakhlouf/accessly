import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default async function Loading() {
    const t = await getTranslations("invitePage");

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6">
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            {t("loading")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
