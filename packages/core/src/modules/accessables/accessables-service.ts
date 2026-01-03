import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from '@accessly/types';
import { ok, err } from '../../types/result';
import { AccessableErrorCode } from './errors';
import type {
  Accessable,
  TypedAccessableInsert,
  TypedAccessableUpdate,
} from './types';

export interface AccessablesServiceDeps {
  supabase: SupabaseClient<SupabaseDatabase>;
  userId: string;
}

export class AccessablesService {
  private supabase: SupabaseClient<SupabaseDatabase>;
  private userId: string;

  constructor(deps: AccessablesServiceDeps) {
    this.supabase = deps.supabase;
    this.userId = deps.userId;
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Failed to get accessable by id:', error);
      return err(AccessableErrorCode.FAILED_TO_LOAD);
    }

    if (!data) {
      return err(AccessableErrorCode.NOT_FOUND);
    }

    return ok(data as Accessable);
  }

  async getByBoardId(boardId: string) {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get accessables by board id:', error);
      return err(AccessableErrorCode.FAILED_TO_LOAD);
    }

    return ok((data || []) as Accessable[]);
  }

  async getByOrganizationId(organizationId: string) {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get accessables by organization id:', error);
      return err(AccessableErrorCode.FAILED_TO_LOAD);
    }

    return ok((data || []) as Accessable[]);
  }

  async create(input: TypedAccessableInsert) {
    const { data, error } = await this.supabase
      .from('accessables')
      .insert({ ...input, user_id: this.userId })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to create accessable:', error);
      return err(AccessableErrorCode.FAILED_TO_CREATE);
    }

    return ok(data as Accessable);
  }

  async update(id: string, updates: TypedAccessableUpdate) {
    const { data, error } = await this.supabase
      .from('accessables')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to update accessable:', error);
      return err(AccessableErrorCode.FAILED_TO_UPDATE);
    }

    return ok(data as Accessable);
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('accessables')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete accessable:', error);
      return err(AccessableErrorCode.FAILED_TO_DELETE);
    }

    return ok({ success: true as const });
  }
}
