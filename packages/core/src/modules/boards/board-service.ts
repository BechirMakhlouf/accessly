import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from '@accessly/types';
import { ok, err } from '../../types/result';
import { isRlsError } from '../../utils/supabase';
import { BoardErrorCode } from './errors';
import type {
  BoardInput,
  BoardUpdate,
  BoardRole,
  BoardWithMembers,
  BoardMembership,
} from './types';

export interface BoardServiceDeps {
  supabase: SupabaseClient<SupabaseDatabase>;
  adminSupabase: SupabaseClient<SupabaseDatabase>;
  userId: string;
}

export class BoardService {
  private supabase: SupabaseClient<SupabaseDatabase>;
  private supabaseAdmin: SupabaseClient<SupabaseDatabase>;
  private userId: string;

  constructor(deps: BoardServiceDeps) {
    this.supabase = deps.supabase;
    this.supabaseAdmin = deps.adminSupabase;
    this.userId = deps.userId;
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*, members:board_members(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Failed to get board by slug:', error);
      return err(BoardErrorCode.FAILED_TO_LOAD);
    }

    if (!data) {
      return err(BoardErrorCode.NOT_FOUND);
    }

    return ok(data as BoardWithMembers);
  }

  async getById(boardId: string) {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*')
      .eq('id', boardId)
      .single();

    if (error) {
      console.error('Failed to get board by id:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(BoardErrorCode.UNAUTHORIZED);
      }
      return err(BoardErrorCode.FAILED_TO_LOAD);
    }

    if (!data) {
      return err(BoardErrorCode.NOT_FOUND);
    }

    return ok(data);
  }

  async getByOrganizationId(orgId: string) {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get boards by organization id:', error);
      return err(BoardErrorCode.FAILED_TO_LOAD);
    }

    return ok(data || []);
  }

  async create(input: BoardInput) {
    const { data, error } = await this.supabase
      .from('boards')
      .insert({ ...input, slug: '' })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to create board:', error);
      return err(BoardErrorCode.FAILED_TO_CREATE);
    }

    return ok(data);
  }

  async update(boardId: string, updates: BoardUpdate) {
    const { data, error } = await this.supabase
      .from('boards')
      .update(updates)
      .eq('id', boardId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update board:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(BoardErrorCode.UNAUTHORIZED);
      }
      return err(BoardErrorCode.FAILED_TO_UPDATE);
    }

    return ok(data);
  }

  async delete(boardId: string) {
    const { error } = await this.supabase
      .from('boards')
      .delete()
      .eq('id', boardId);

    if (error) {
      console.error('Failed to delete board:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(BoardErrorCode.UNAUTHORIZED);
      }
      return err(BoardErrorCode.FAILED_TO_DELETE);
    }

    return ok({ success: true as const });
  }

  async hardDelete(boardId: string) {
    if (!this.supabaseAdmin) {
      return err(BoardErrorCode.UNAUTHORIZED);
    }

    const { error } = await this.supabaseAdmin
      .from('boards')
      .delete()
      .eq('id', boardId);

    if (error) {
      console.error('Failed to hard delete board:', error);
      return err(BoardErrorCode.FAILED_TO_DELETE);
    }

    return ok({ success: true as const });
  }

  async updateMemberRole(
    boardId: string,
    memberId: string,
    newRole: BoardRole
  ) {
    if (!this.userId) {
      return err(BoardErrorCode.UNAUTHORIZED);
    }

    const { data: currentUserMembership, error: membershipError } =
      await this.supabase
        .from('board_members')
        .select('role')
        .eq('board_id', boardId)
        .eq('user_id', this.userId)
        .single();

    if (membershipError || !currentUserMembership) {
      console.error(
        'Failed to check current user membership:',
        membershipError
      );
      return err(BoardErrorCode.MEMBER_LOAD_ERROR);
    }

    if (currentUserMembership.role !== 'admin') {
      return err(BoardErrorCode.MEMBER_INSUFFICIENT_PERMISSIONS);
    }

    const { data, error } = await this.supabase
      .from('board_members')
      .update({ role: newRole })
      .eq('board_id', boardId)
      .eq('user_id', memberId)
      .select('role')
      .single();

    if (error) {
      console.error('Failed to update member role:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(BoardErrorCode.MEMBER_UNAUTHORIZED);
      }
      return err(BoardErrorCode.MEMBER_FAILED_TO_UPDATE);
    }

    return ok(data);
  }

  async getMyMembership(boardId: string) {
    if (!this.userId) {
      return err(BoardErrorCode.UNAUTHORIZED);
    }

    const { data, error } = await this.supabase
      .rpc('get_board_membership', {
        p_user_id: this.userId,
        p_board_id: boardId,
      })
      .maybeSingle();

    if (error) {
      console.error('Failed to get board membership:', error);
      return err(BoardErrorCode.FAILED_TO_LOAD_MEMBERSHIP);
    }

    if (!data) {
      return err(BoardErrorCode.MEMBERSHIP_NOT_FOUND);
    }

    return ok(data as { user_id: string; board_role: BoardRole });
  }

  async getMembers(boardId: string) {
    if (!this.userId) {
      return err(BoardErrorCode.UNAUTHORIZED);
    }

    const { data, error } = await this.supabase.rpc('get_board_members', {
      p_board_id: boardId,
    });

    if (error) {
      console.error('Failed to get board members:', error);
      return err(BoardErrorCode.FAILED_TO_LOAD_MEMBERS);
    }

    return ok((data ?? []) as BoardMembership[]);
  }
}
