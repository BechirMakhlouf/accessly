'use server';

import { createBoardService } from './board-factory';
import type { BoardInput, BoardRole, BoardUpdate } from './types';

export async function getBoardBySlug(slug: string) {
  const service = await createBoardService();
  return service.getBoardBySlug(slug);
}

export async function getBoardById(boardId: string) {
  const service = await createBoardService();
  return service.getBoardById(boardId);
}

export async function getBoardsByOrganizationId(orgId: string) {
  const service = await createBoardService();
  return service.getBoardsByOrganizationId(orgId);
}

export async function createBoard(input: BoardInput) {
  const service = await createBoardService();
  return service.createBoard(input);
}

export async function updateBoard(boardId: string, updates: BoardUpdate) {
  const service = await createBoardService();
  return service.updateBoard(boardId, updates);
}

export async function deleteBoard(boardId: string) {
  const service = await createBoardService();
  return service.deleteBoard(boardId);
}

export async function updateBoardMemberRole(
  boardId: string,
  memberId: string,
  newRole: BoardRole
) {
  const service = await createBoardService();
  return service.updateMemberRole(boardId, memberId, newRole);
}

// Hard delete (admin)
export async function hardDeleteBoard(boardId: string) {
  const service = await createBoardService();
  return service.delete(boardId);
}

export async function getBoardMembership(userId: string, boardId: string) {
  const service = await createBoardService();
  return service.getMyBoardMembership(userId, boardId);
}
export async function getBoardMembers(boardId: string) {
  const service = await createBoardService();
  return service.getBoardMembers(boardId);
}
