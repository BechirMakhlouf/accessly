'use server';

import { createBoardService } from './board-factory';
import type { BoardInput, BoardRole, BoardUpdate } from '@accessly/core';

export async function getBoardBySlug(slug: string) {
  const service = await createBoardService();
  return service.getBySlug(slug);
}

export async function getBoardById(boardId: string) {
  const service = await createBoardService();
  return service.getById(boardId);
}

export async function getBoardsByOrganizationId(orgId: string) {
  const service = await createBoardService();
  return service.getByOrganizationId(orgId);
}

export async function createBoard(input: BoardInput) {
  const service = await createBoardService();
  return service.create(input);
}

export async function updateBoard(boardId: string, updates: BoardUpdate) {
  const service = await createBoardService();
  return service.update(boardId, updates);
}

export async function deleteBoard(boardId: string) {
  const service = await createBoardService();
  return service.delete(boardId);
}

export async function updateBoardMemberRole(
  boardId: string,
  memberId: string,
  newRole: BoardRole
) {
  const service = await createBoardService();
  return service.updateMemberRole(boardId, memberId, newRole);
}

export async function hardDeleteBoard(boardId: string) {
  const service = await createBoardService();
  return service.hardDelete(boardId);
}

export async function getBoardMembership(boardId: string) {
  const service = await createBoardService();
  return service.getMyMembership(boardId);
}

export async function getBoardMembers(boardId: string) {
  const service = await createBoardService();
  return service.getMembers(boardId);
}
