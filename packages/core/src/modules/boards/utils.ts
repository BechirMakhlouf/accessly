import type { BoardAdminRole, BoardRole } from './types';

export const isBoardAdminRole = (role: BoardRole): role is BoardAdminRole => {
  return role === 'admin';
};

export const canManageBoardMembers = (role: BoardRole): boolean => {
  return isBoardAdminRole(role);
};
