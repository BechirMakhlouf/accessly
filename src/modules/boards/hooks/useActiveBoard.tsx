"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBoardBySlugQueryOptions } from "../queries";
import { getStringFromParamValue } from "@/lib/utils/next-utils";

/**
 * Hook that checks if the current pathname is under a board context
 * and returns the active board data if found.
 *
 * @returns Object containing:
 * - activeBoard: Board data if under board context, null otherwise
 * - isLoading: Loading state
 * - error: Error state
 * - isUnderBoardContext: Boolean indicating if current path is under board context
 */
export function useActiveBoard() {
    const { slug: orgSlugParam, boardSlug: boardSlugParam } = useParams();

    // Extract and validate orgSlug from params (expecting string)
    const orgSlug = getStringFromParamValue(orgSlugParam);

    // Extract boardSlug from params (expecting string)
    const boardSlug = getStringFromParamValue(boardSlugParam);

    // Check if we're under a board context - if both slugs exist and are strings
    const isUnderBoardContext = !!boardSlug && !!orgSlug;

    // Only fetch board data if we're under board context
    const {
        data: activeBoard,
        isLoading,
        error,
    } = useQuery({
        ...getBoardBySlugQueryOptions(boardSlug!),
        enabled: isUnderBoardContext && !!boardSlug,
    });

    return {
        activeBoard: isUnderBoardContext ? activeBoard : null,
        isLoading: isUnderBoardContext ? isLoading : false,
        error: isUnderBoardContext ? error : null,
        isUnderBoardContext,
        orgSlug,
        boardSlug,
    };
}
