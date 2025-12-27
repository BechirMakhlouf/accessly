'use server';

import { createAccessablesService } from './accessables-factory';
import type { AccessableInsert, AccessableUpdate } from './types';

export async function getAccessableById(id: string) {
  const service = await createAccessablesService();
  return service.getById(id);
}

export async function getAccessablesByBoardId(boardId: string) {
  const service = await createAccessablesService();
  return service.getByBoardId(boardId);
}

export async function getAccessablesByOrganizationId(organizationId: string) {
  const service = await createAccessablesService();
  return service.getByOrganizationId(organizationId);
}

export async function createAccessable(input: AccessableInsert) {
  const service = await createAccessablesService();
  return service.create(input);
}

export async function updateAccessable(id: string, updates: AccessableUpdate) {
  const service = await createAccessablesService();
  return service.update(id, updates);
}

export async function deleteAccessable(id: string) {
  const service = await createAccessablesService();
  return service.delete(id);
}
