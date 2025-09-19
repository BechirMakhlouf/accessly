"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { Check, ChevronsUpDown, Plus, Search, Layout, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"
import { useActiveBoard, useActiveOrgBoards, Board } from "@/modules/boards"
import { useActiveOrg } from "@/modules/organizations"
import { useTranslations } from "next-intl"
import { CreateBoardModal } from "./create-board-modal"

export function BoardsDropdown({ trigger }: { trigger?: ReactNode } = {}) {
    const router = useRouter()
    const { activeOrganization } = useActiveOrg()
    const { activeBoard, isUnderBoardContext } = useActiveBoard()
    const { boards, isLoading } = useActiveOrgBoards()
    const t = useTranslations("boards")
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (open && searchInputRef.current) {
            // Small delay to ensure the popover is fully rendered
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 100)
        }
    }, [open])

    // Filter boards based on search query
    const filteredBoards = boards?.filter(
        (board) =>
            board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            board.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            board.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

    const handleSelectBoard = (selectedBoard: Board) => {
        setOpen(false)
        setSearchQuery("")

        // Navigate to the selected board
        if (activeOrganization?.slug) {
            router.push(routes.protected.dashboard.org.slug.board.root(activeOrganization.slug, selectedBoard.slug))
        }
    }


    const handleViewAllBoards = () => {
        setOpen(false)
        setSearchQuery("")
        if (activeOrganization?.slug) {
            router.push(routes.protected.dashboard.org.slug.boards.root(activeOrganization.slug))
        }
    }

    const getVisibilityIcon = (visibility: string) => {
        return visibility === "public" ? (
            <Eye className="h-3 w-3" />
        ) : (
            <EyeOff className="h-3 w-3" />
        )
    }

    const getVisibilityLabel = (visibility: string) => {
        return visibility === "public" ? t("visibility.public") : t("visibility.private")
    }

    if (!isUnderBoardContext) {
        return null // Don't show dropdown if no active organization or not in board context
    }

    // Default trigger with board name
    const defaultTrigger = (
        <Button
            variant="ghost"
            className="h-8 px-2 gap-2 shrink-0 data-[state=open]:bg-accent max-w-[50vw] sm:max-w-[320px]"
            aria-label="Switch board"
        >
            <span className="truncate text-sm leading-none text-muted-foreground">
                {activeBoard ? activeBoard.title : t("selectBoard")}
            </span>
            <ChevronsUpDown className="size-4 opacity-60 shrink-0" />
        </Button>
    )

    if (isLoading && (!boards || boards.length === 0)) {
        return (
            <div className="w-full max-w-sm">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {trigger ?? defaultTrigger}
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Loading boards...
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {trigger ?? defaultTrigger}
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={searchInputRef}
                                placeholder={t("search.placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {/* Boards Section */}
                        {filteredBoards.length > 0 ? (
                            <div className="p-1">
                                {filteredBoards.map((board) => {
                                    const isSelected = activeBoard?.id === board.id

                                    return (
                                        <div
                                            key={board.id}
                                            className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => handleSelectBoard(board)}
                                        >
                                            <Layout className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{board.title}</span>
                                                    <div className="flex items-center gap-1">
                                                        {getVisibilityIcon(board.visibility)}
                                                        <span className="text-xs text-muted-foreground">
                                                            {getVisibilityLabel(board.visibility)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="truncate">{board.slug}</span>
                                                    {board.description && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate">{board.description}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                {searchQuery ? t("search.noResults.description") : t("empty.description")}
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="p-1 space-y-1">
                        <CreateBoardModal
                            trigger={
                                <div className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                                    <Plus className="h-4 w-4" />
                                    <span>{t("actions.create")}</span>
                                </div>
                            }
                            onSuccess={() => {
                                // The modal will handle closing and the hook will refetch data
                            }}
                        />

                        {boards && boards.length > 0 && (
                            <div
                                className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={handleViewAllBoards}
                            >
                                <Layout className="h-4 w-4" />
                                <span>{t("actions.viewAll")}</span>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
