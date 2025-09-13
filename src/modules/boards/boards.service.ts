import { TypedSupabaseClient } from "@/lib/supabase/type";
import { Board, BoardInput, BoardInsert, BoardRole, BoardUpdate } from "./types";
import { I18nMessageKey } from "@/lib/i18n";

export interface ServiceResult<T> { data?: T; error?: I18nMessageKey }

// BoardsService: encapsulates board data access & mutations (no UI concerns)
export class BoardsService {
    private readonly supabase: TypedSupabaseClient;
    private readonly supabaseAdmin: TypedSupabaseClient;
    private readonly userId?: string;

    constructor(
        supabase: TypedSupabaseClient,
        supabaseAdmin: TypedSupabaseClient,
        userId?: string
    ) {
        this.supabase = supabase;
        this.supabaseAdmin = supabaseAdmin;
        this.userId = userId;
    }

    // Retrieval
    async getBoardBySlug(slug: string): Promise<Board> {
        const { data, error: dbError } = await this.supabase
            .from("boards")
            .select("*")
            .eq("slug", slug)
            .single();
        if (dbError) throw dbError;
        return data;
    }

    async getBoardById(boardId: string): Promise<Board> {
        const { data, error: dbError } = await this.supabase
            .from("boards")
            .select("*")
            .eq("id", boardId)
            .single();
        if (dbError) throw dbError;
        return data;
    }

    // Mutations
    async createBoard(input: BoardInput): Promise<ServiceResult<Board>> {
        const createdBy = input.created_by ?? this.userId;
        if (!createdBy) return { error: "error_not_authenticated" as I18nMessageKey };

        const payload: BoardInsert = { ...input, created_by: createdBy };
        const { data, error: dbError } = await this.supabase
            .from("boards")
            .insert(payload)
            .select("*")
            .single();
        if (dbError || !data) return { error: "error_creating_board" as I18nMessageKey };
        return { data };
    }

    async updateBoard(boardId: string, updates: BoardUpdate): Promise<ServiceResult<Board>> {
        const { data, error: dbError } = await this.supabase
            .from("boards")
            .update(updates)
            .eq("id", boardId)
            .select("*")
            .single();
        if (dbError) return { error: "error_updating_board" as I18nMessageKey };
        return { data };
    }

    async deleteBoard(boardId: string): Promise<ServiceResult<null>> {
        const { error: dbError } = await this.supabase
            .from("boards")
            .delete()
            .eq("id", boardId);
        if (dbError) return { error: "error_deleting_board" as I18nMessageKey };
        return { data: null };
    }

    // Membership / Roles
    async updateMemberRole(
        boardId: string,
        memberId: string,
        newRole: BoardRole
    ): Promise<ServiceResult<{ role: BoardRole }>> {
        if (!this.userId) return { error: "error_not_authenticated" as I18nMessageKey };

        const { data: currentUserMembership, error: membershipError } = await this.supabase
            .from("board_members")
            .select("role")
            .eq("board_id", boardId)
            .eq("user_id", this.userId)
            .single();

        if (membershipError || !currentUserMembership || currentUserMembership.role !== "admin") {
            return { error: "error_insufficient_permissions" as I18nMessageKey };
        }

        const { data, error: dbError } = await this.supabase
            .from("board_members")
            .update({ role: newRole })
            .eq("board_id", boardId)
            .eq("user_id", memberId)
            .select("role")
            .single();
        if (dbError) return { error: "error_updating_member_role" as I18nMessageKey };
        return { data };
    }

    // Hard delete (admin service role required)
    async delete(boardId: string): Promise<ServiceResult<null>> {
        if (!this.supabaseAdmin) return { error: "board.unauthorized" as I18nMessageKey };
        const { error: dbError } = await this.supabase
            .from("boards")
            .delete()
            .eq("id", boardId);
        if (dbError) return { error: "error_deleting_board" as I18nMessageKey };
        return { data: null };
    }
}


