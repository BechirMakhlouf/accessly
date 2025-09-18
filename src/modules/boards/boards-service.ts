import { TypedSupabaseClient } from "@/lib/supabase/type";
import {
    Board,
    BoardInput,
    BoardInsert,
    BoardRole,
    BoardUpdate,
    BoardWithMembers,
} from "./types";
import type { ServiceResult } from "@/lib/types";

// BoardsService: encapsulates board data access & mutations (no UI concerns)
export class BoardsService {
    private readonly supabase: TypedSupabaseClient;
    private readonly supabaseAdmin: TypedSupabaseClient;
    private readonly userId?: string;

    constructor(
        supabase: TypedSupabaseClient,
        supabaseAdmin: TypedSupabaseClient,
        userId?: string,
    ) {
        this.supabase = supabase;
        this.supabaseAdmin = supabaseAdmin;
        this.userId = userId;
    }

    // Retrieval
    async getBoardBySlug(
        slug: string,
    ): Promise<ServiceResult<BoardWithMembers>> {
        const { data, error } = await this.supabase
            .from("boards")
            .select("*, members:board_members(*)")
            .eq("slug", slug)
            .maybeSingle();
        if (error) {
            console.error("Failed to get board by slug:", error);
            return { error: "board.failedToLoad" };
        }

        if (!data) {
            return { error: "board.notFound" };
        }
        return { data };
    }

    async getBoardById(boardId: string): Promise<ServiceResult<Board>> {
        const { data, error } = await this.supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (error) {
            console.error("Failed to get board by id:", error);
            return { error: "board.failedToLoad" };
        }
        if (!data) {
            return { error: "board.notFound" };
        }
        return { data };
    }

    async getBoardsByOrganizationId(
        orgId: string,
    ): Promise<ServiceResult<Board[]>> {
        const { data, error } = await this.supabase
            .from("boards")
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Failed to get boards by organization id:", error);
            return { error: "board.failedToLoad" };
        }
        return { data: data || [] };
    }

    // Mutations
    async createBoard(input: BoardInput): Promise<ServiceResult<Board>> {
        const { data, error } = await this.supabase
            .from("boards")
            .insert(input as BoardInsert)
            .select("*")
            .single();
        if (error || !data) return { error: "board.failedToCreate" };
        return { data };
    }

    async updateBoard(
        boardId: string,
        updates: BoardUpdate,
    ): Promise<ServiceResult<Board>> {
        const { data, error: dbError } = await this.supabase
            .from("boards")
            .update(updates)
            .eq("id", boardId)
            .single();
        if (dbError) return { error: "board.failedToUpdate" };
        return { data };
    }

    async deleteBoard(boardId: string): Promise<ServiceResult<null>> {
        const { error: dbError } = await this.supabase
            .from("boards")
            .delete()
            .eq("id", boardId);
        if (dbError) return { error: "board.failedToDelete" };
        return { data: null };
    }

    // Membership / Roles
    async updateMemberRole(
        boardId: string,
        memberId: string,
        newRole: BoardRole,
    ): Promise<ServiceResult<{ role: BoardRole }>> {
        if (!this.userId) return { error: "board.unauthorized" };

        const { data: currentUserMembership, error: membershipError } =
            await this.supabase
                .from("board_members")
                .select("role")
                .eq("board_id", boardId)
                .eq("user_id", this.userId)
                .single();

        if (
            membershipError || !currentUserMembership ||
            currentUserMembership.role !== "admin"
        ) {
            return { error: "board.insufficientPermissions" };
        }

        const { data, error: dbError } = await this.supabase
            .from("board_members")
            .update({ role: newRole })
            .eq("board_id", boardId)
            .eq("user_id", memberId)
            .select("role")
            .single();
        if (dbError) return { error: "board.failedToUpdate" };
        return { data };
    }

    // Check if user has access to a board by slug and organization
    async checkUserBoardAccess(
        boardSlug: string,
        orgSlug: string,
    ): Promise<ServiceResult<boolean>> {
        if (!this.userId) return { error: "board.unauthorized" };

        const { data, error } = await this.supabase
            .from("boards")
            .select(`
                id,
                slug,
                organization_id,
                organization:organizations!inner(slug)
            `)
            .eq("slug", boardSlug)
            .eq("organizations.slug", orgSlug)
            .single();

        if (error || !data) {
            return { data: false };
        }

        // Check if user is a member of this board
        const { data: membership, error: membershipError } = await this.supabase
            .from("board_members")
            .select("id")
            .eq("board_id", data.id)
            .eq("user_id", this.userId)
            .single();

        if (membershipError || !membership) {
            return { data: false };
        }

        return { data: true };
    }

    // Hard delete (admin service role required)
    async delete(boardId: string): Promise<ServiceResult<null>> {
        if (!this.supabaseAdmin) return { error: "board.unauthorized" };
        const { error: dbError } = await this.supabase
            .from("boards")
            .delete()
            .eq("id", boardId);
        if (dbError) return { error: "board.failedToDelete" };
        return { data: null };
    }
}
