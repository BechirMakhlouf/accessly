import { TypedSupabaseClient } from "@/lib/supabase/type";
import {
  Board,
  BoardInput,
  BoardMember,
  BoardMembership,
  BoardRole,
  BoardUpdate,
  BoardWithMembers,
} from "./types";
import type { ServiceResult } from "@/lib/types";

// BoardsService: encapsulates board data access & mutations (no UI concerns)
export class BoardsService {
  private readonly supabase: TypedSupabaseClient;
  private readonly supabaseAdmin: TypedSupabaseClient;
  private readonly userId: string;

  constructor(
    supabase: TypedSupabaseClient,
    supabaseAdmin: TypedSupabaseClient,
    userId: string,
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
    // Ensure slug is provided or generate a fallback

    const { data, error } = await this.supabase
      .from("boards")
      .insert({ ...input, slug: "" })
      .select("*")
      .single();
    if (error || !data)
{
      return { error: "board.failedToCreate" };
    }

    
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

    const { data: currentUserMembership, error: membershipError } = await this
      .supabase
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
  async addBoardMember(
    boardId: string,
    memberId: string,
  ): Promise<ServiceResult<BoardMember>> {
    let role: BoardRole = "member";    

    if (!this.userId) return { error: "board.unauthorized" };
  

    const userMembership = this.getMyBoardMembership(memberId, boardId);
    if ((await userMembership).data?.board_role === "admin") {
      role = "admin";
    }

    const { data, error: dbError } = await this.supabase
      .from("board_members")
      .insert({ board_id: boardId, user_id: memberId, role: role })
      .select("*")
      .single();
    if (dbError) {
      console.error("Failed to add member to board:", dbError);
      return { error: "board.failedToLoad" };
    }
    return { data };
  }
  
  // Check if user has access to a board by slug and organization
  async getBoardMembership(
    user_id: string,
    boardId: string,
  ): Promise<ServiceResult<boolean>> {
    this.supabase.rpc("get_board_membership", {
      p_board_id: boardId,
      p_user_id: user_id,
    });
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
        async getMyBoardMembership(user_id :string,boardId: string): Promise<ServiceResult<{ user_id: string; board_role: BoardRole }>> {
        if (!this.userId) return { error: "board.unauthorized" };

        const { data, error } = await this.supabase.rpc('get_board_membership', { p_user_id: user_id, p_board_id: boardId }).maybeSingle();
            

        if (error) {
            console.error("Failed to get  board membership:", error);
            return { error: "board.failedToLoadMembership" };
        }

        if (!data) {
            return { error: "board.membershipNotFound" };
        }
        return { data: data };
    }
  // ...existing code...
    async getBoardMembers(boardId: string): Promise<ServiceResult<BoardMembership[]>> {
        if (!this.userId) return { error: "board.unauthorized" };

        const { data, error } = await this.supabase.rpc('get_board_members', { p_board_id: boardId });

        if (error) {
            console.error("Failed to get board members:", error);
            return { error: "board.failedToLoadMembers" };
        }

        return { data: (data ?? []) };
    }}
