import { getTranslations } from "next-intl/server";
import { getBoardBySlug } from "@/modules/boards/actions";
import { BoardAccessablesContent } from "./board-accessables-content";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function BoardAccessablesPage({
  params,
}: {
  params: Promise<{ slug: string; boardSlug: string }>;
}) {
  const t = await getTranslations();
  const { slug: orgSlug, boardSlug } = await params;

  const boardResult = await getBoardBySlug(boardSlug);

  if (boardResult.error || !boardResult.data) {
    redirect(routes.protected.dashboard.org.slug.boards.root(orgSlug));
  }

  const board = boardResult.data;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("accessables.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("accessables.description")}
          </p>
        </div>
      </div>

      <BoardAccessablesContent
        organizationId={board.organization_id}
        boardId={board.id}
      />
    </div>
  );
}
