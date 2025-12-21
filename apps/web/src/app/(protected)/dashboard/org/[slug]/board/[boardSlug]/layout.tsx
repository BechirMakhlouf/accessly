import { routes } from '@/lib/routes';
import { getBoardBySlug } from '@/modules/boards/actions';
import { redirect } from 'next/navigation';

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; boardSlug: string }>;
}) {
  const { slug: orgSlug, boardSlug } = await params;
  const board = await getBoardBySlug(boardSlug);

  if (board.error || !board.data) {
    redirect(routes.protected.dashboard.org.slug.boards.root(orgSlug));
  }

  return <>{children}</>;
}
