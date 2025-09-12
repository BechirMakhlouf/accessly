import { TypedSupabaseClient } from "@/lib/supabase/type";
import { Board, BoardInput, BoardRole, BoardUpdate } from "./types";
import { I18nMessageKey } from "@/lib/i18n";

export interface ServiceResult<T> {
  data?: T;
  error?: I18nMessageKey;
}
export class BoardsService {
     private supabase: TypedSupabaseClient;
      private supabaseAdmin: TypedSupabaseClient;
      private userId?: string;
    constructor(supabase: TypedSupabaseClient, supabaseAdmin: TypedSupabaseClient, userId?: string) {
        this.supabase = supabase;
        this.supabaseAdmin = supabaseAdmin;
        this.userId = userId;       }
        async getBoardBySlug(slug: string) {
        const { data, error } = await this.supabase
            .from('boards')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) {
            throw error;
        }
        return data;
    }   
        
        async getBoardById(boardId: string) {
        const { data, error } = await this.supabase
            .from('boards')
            .select('*')
            .eq('id', boardId)
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
    async createBoard(input: BoardInput): Promise<ServiceResult<Board>> {
        const { data, error } = await this.supabase
            .from('boards')
            .insert(input);
        if (error) {
            return { error };
        }
        return { data };
       }  
    async deleteBoard(boardId: string): Promise<ServiceResult<null>> {
        const { data, error } = await this.supabase
            .from('boards')
            .delete()
            .eq('id', boardId);
        if (error) {
            return { error };
        }
        return { data: null };
    }
    async updateBoard(boardId: string, updates: BoardUpdate): Promise<ServiceResult<Board>> {
        const { data, error } = await this.supabase
            .from('boards')
            .update(updates)
            .eq('id', boardId)
            .single();
        if (error) {
            return { error };
        }
        return { data };        
    }
    async updateMemberRole(
         orgId: string,
            memberId: string,
            newRole: BoardRole,
    ){
        if (!this.userId) {
            return { error: 'error_not_authenticated' as I18nMessageKey };
        }
        // Check if current user is admin
        const { data: currentUserMembership, error: membershipError } = await this.supabase
            .from('board_members')
            .select('role')
            .eq('board_id', orgId)
            .eq('user_id', this.userId)
            .single();
        if (membershipError || !currentUserMembership) {
            return { error: 'error_insufficient_permissions' as I18nMessageKey };
        }
        if (currentUserMembership.role !== 'admin') {
            return { error: 'error_insufficient_permissions' as I18nMessageKey };
        }
        // Update member role
        const { data, error } = await this.supabase
            .from('board_members')
            .update({ role: newRole })
            .eq('board_id', orgId)
            .eq('user_id', memberId)
            .single();
        if (error) {
            return { error: 'error_updating_member_role' as I18nMessageKey };
        }
        return { data };

    }
    async delete(boardId: string): Promise<ServiceResult<null>> {
           if (!this.supabaseAdmin) {
      return { error: "board.unauthorized" };
    } 
        const { data, error } = await this.supabase
            .from('boards')
            .delete()
            .eq('id', boardId);
        if (error) {
            return { error: 'error_deleting_board' as I18nMessageKey };
        }
        return { data: null };
    }
}


