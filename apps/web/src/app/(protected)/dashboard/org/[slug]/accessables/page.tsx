import { getTranslations } from "next-intl/server";
import { OrganizationAccessables } from "./organization-accessables-content";

export default async function OrganizationAccessablesPage() {
  const t = await getTranslations();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("accessables.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("accessables.orgLevelDescription")}
          </p>
        </div>
      </div>

      <OrganizationAccessables />
    </div>
  );
}
