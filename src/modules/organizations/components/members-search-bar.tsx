import { Search, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface MembersSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMembersCount: number;
  canManageMembers: boolean;
  isDeleting: boolean;
  onBulkDelete: () => void;
}

export const MembersSearchBar = ({
  searchQuery,
  onSearchChange,
  selectedMembersCount,
  canManageMembers,
  isDeleting,
  onBulkDelete,
}: MembersSearchBarProps) => {
  const t = useTranslations("org.members");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {selectedMembersCount > 0 && canManageMembers && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{t('selected', { count: selectedMembersCount })}</Badge>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onBulkDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {t('deleteSelected')}
          </Button>
        </div>
      )}
    </div>
  );
};
