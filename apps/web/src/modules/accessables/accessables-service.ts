import type { TypedSupabaseClient } from '@/lib/supabase/type';
import type { ServiceResult } from '@/lib/types';
import type { Accessable, AccessableInsert, AccessableUpdate } from './types';

export class AccessablesService {
  private readonly supabase: TypedSupabaseClient;
  private readonly userId: string;

  constructor(supabase: TypedSupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
  }

  async getById(id: string): Promise<ServiceResult<Accessable>> {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Failed to get accessable by id:', error);
      return { error: 'accessable.failedToLoad' };
    }

    if (!data) {
      return { error: 'accessable.notFound' };
    }

    return { data };
  }

  async getByBoardId(boardId: string): Promise<ServiceResult<Accessable[]>> {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get accessables by board id:', error);
      return { error: 'accessable.failedToLoad' };
    }

    return { data: data || [] };
  }

  async getByOrganizationId(
    organizationId: string
  ): Promise<ServiceResult<Accessable[]>> {
    const { data, error } = await this.supabase
      .from('accessables')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get accessables by organization id:', error);
      return { error: 'accessable.failedToLoad' };
    }

    return { data: data || [] };
  }

  async create(input: AccessableInsert): Promise<ServiceResult<Accessable>> {
    const { data, error } = await this.supabase
      .from('accessables')
      .insert({ ...input, user_id: this.userId })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to create accessable:', error);
      return { error: 'accessable.failedToCreate' };
    }

    return { data };
  }

  async update(
    id: string,
    updates: AccessableUpdate
  ): Promise<ServiceResult<Accessable>> {
    const { data, error } = await this.supabase
      .from('accessables')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to update accessable:', error);
      return { error: 'accessable.failedToUpdate' };
    }

    return { data };
  }

  async delete(id: string): Promise<ServiceResult<null>> {
    const { error } = await this.supabase
      .from('accessables')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete accessable:', error);
      return { error: 'accessable.failedToDelete' };
    }

    return { data: null };
  }
}
