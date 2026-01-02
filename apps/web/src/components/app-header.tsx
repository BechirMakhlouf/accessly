import { ContextNavigation } from "./context-navigation";
import { AppSearchBar } from "./app-search-bar";
import UserDropdown from "./user-dropdown";
import { NotificationsPopover } from "./notification-popover";
import { AddAccessableButton } from "./add-accessable-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Left: Context Navigation */}
        <div className="min-w-0">
          <ContextNavigation />
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <AddAccessableButton />
          <AppSearchBar />
          <NotificationsPopover />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
