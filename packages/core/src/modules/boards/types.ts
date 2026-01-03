import type { Database } from '@accessly/types';
import type { WithOptional } from '../../types/helpers';
import type { Profile } from '../organizations/types';

export type Board = Database['public']['Tables']['boards']['Row'];
export type BoardInsert = Database['public']['Tables']['boards']['Insert'];
export type BoardUpdate = Database['public']['Tables']['boards']['Update'];
export type BoardMember = Database['public']['Tables']['board_members']['Row'];

export type BoardRole = Database['public']['Enums']['boards_role'];
export type BoardVisibility = Database['public']['Enums']['boards_visibility'];

export type BoardAdminRole = Extract<BoardRole, 'admin'>;

export type BoardInput = WithOptional<BoardInsert, 'slug'>;

export interface BoardWithMembers extends Board {
  members: BoardMember[];
}

export interface BoardMemberWithProfile extends BoardMember {
  profile?: Profile;
}

export interface BoardMembership {
  user_id: string;
  role: BoardRole;
  membership_origin: string;
}
