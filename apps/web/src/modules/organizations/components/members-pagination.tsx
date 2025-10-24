import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface MembersPaginationProps {
  totalPages: number;
  currentPage: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const MembersPagination = ({
  totalPages,
  currentPage,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
}: MembersPaginationProps) => {
  const t = useTranslations("org.members");

  if (totalPages <= 1) {
    return null;
  }

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {t('showing', {
          start: String(startIndex + 1),
          end: String(endIndex),
          total: String(totalItems)
        })}
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          {t('previous')}
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
};
