# Module Migration Guide: Web to Core

This guide documents how to migrate business logic modules from `@apps/web` to `@accessly/core`.

## When to Migrate

Migrate a module to core when:

- The business logic needs to be shared across multiple apps (web, service, mobile)
- The module has no React/Next.js dependencies
- The logic is stable and well-tested

## Architecture Overview

```
@accessly/core (packages/core)
├── Service class with business logic
├── Types (database types, inputs, outputs)
├── Error codes
└── Utility functions

@apps/web (apps/web)
├── Factory (creates service instance with dependencies)
├── Actions (server actions that call service methods)
├── Queries (TanStack Query options that call actions)
├── Hooks (React hooks using queries/mutations)
└── Components (UI components)
```

## Core Package Structure

### 1. Types (`types.ts`)

Define all types derived from the database schema:

```typescript
// packages/core/src/modules/{module}/types.ts

import type { Database } from '@accessly/types';
import type { WithOptional } from '../../types/helpers';

export type Board = Database['public']['Tables']['boards']['Row'];
export type BoardInsert = Database['public']['Tables']['boards']['Insert'];
export type BoardUpdate = Database['public']['Tables']['boards']['Update'];

export type BoardRole = Database['public']['Enums']['boards_role'];

export type BoardInput = WithOptional<BoardInsert, 'slug'>;

export interface BoardWithMembers extends Board {
  members: BoardMember[];
}
```

### 2. Errors (`errors.ts`)

Define error codes as a const object:

```typescript
// packages/core/src/modules/{module}/errors.ts

export const BoardErrorCode = {
  NOT_FOUND: 'BOARD_NOT_FOUND',
  FAILED_TO_LOAD: 'BOARD_FAILED_TO_LOAD',
  FAILED_TO_CREATE: 'BOARD_FAILED_TO_CREATE',
  UNAUTHORIZED: 'BOARD_UNAUTHORIZED',
  // ...
} as const;

export type BoardErrorCode =
  (typeof BoardErrorCode)[keyof typeof BoardErrorCode];
```

### 3. Service (`{module}-service.ts`)

Create a service class that:

- Accepts dependencies via constructor (Supabase clients, userId)
- Uses `ok()` and `err()` helpers for Result types
- Does NOT use explicit return type annotations (let TypeScript infer)

```typescript
// packages/core/src/modules/{module}/{module}-service.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from '@accessly/types';
import { ok, err } from '../../types/result';
import { BoardErrorCode } from './errors';
import type { BoardInput, BoardUpdate } from './types';

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

  async getById(boardId: string) {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*')
      .eq('id', boardId)
      .single();

    if (error) {
      console.error('Failed to get board by id:', error);
      return err(BoardErrorCode.FAILED_TO_LOAD);
    }

    if (!data) {
      return err(BoardErrorCode.NOT_FOUND);
    }

    return ok(data);
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
}
```

### 4. Index (`index.ts`)

Export everything from the module:

```typescript
// packages/core/src/modules/{module}/index.ts

export * from './types';
export * from './errors';
export * from './utils';
export { BoardService, type BoardServiceDeps } from './board-service';
```

### 5. Core Package Index

Add the module to the core package exports:

```typescript
// packages/core/src/index.ts

export * from './modules/boards';
```

## Web App Structure

### 1. Factory (`{module}-factory.ts`)

Creates the service instance with app-specific dependencies:

```typescript
// apps/web/src/modules/{module}/{module}-factory.ts

import { createSSRClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';
import { BoardService } from '@accessly/core';
import { assertSignedInAndGetUserId } from '@/lib/auth/server';

export async function createBoardService(): Promise<BoardService> {
  const adminSupabase = await createAdminClient();
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  return new BoardService({
    supabase,
    adminSupabase,
    userId,
  });
}
```

### 2. Actions (`actions.ts`)

Thin server action wrappers:

```typescript
// apps/web/src/modules/{module}/actions.ts

'use server';

import { createBoardService } from './board-factory';
import type { BoardInput, BoardUpdate } from '@accessly/core';

export async function getBoardById(boardId: string) {
  const service = await createBoardService();
  return service.getById(boardId);
}

export async function createBoard(input: BoardInput) {
  const service = await createBoardService();
  return service.create(input);
}
```

### 3. Queries (`queries.ts`)

TanStack Query options that call actions:

```typescript
// apps/web/src/modules/{module}/queries.ts

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { getBoardById as getBoardByIdAction } from './actions';
import type { Board, BoardInput } from '@accessly/core';

export const BOARD_KEY = 'board';
export const BOARD_BY_ID_KEY = (id: string) => [BOARD_KEY, 'id', id] as const;

export function getBoardByIdQueryOptions(id: string) {
  return {
    queryKey: BOARD_BY_ID_KEY(id),
    queryFn: async (): Promise<Board> => {
      const result = await getBoardByIdAction(id);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('Board not found');
      }
      return result.data;
    },
    enabled: !!id,
  };
}
```

### 4. Index (`index.ts`)

Re-export types from core and export local items:

```typescript
// apps/web/src/modules/{module}/index.ts

// Types (re-exported from core)
export type { Board, BoardInput, BoardUpdate, BoardRole } from '@accessly/core';

// Hooks
export { useActiveBoard } from './hooks/useActiveBoard';

// Actions
export * from './actions';

// Queries
export * from './queries';

// Components
export { CreateBoardModal } from './components/create-board-modal';
```

## Migration Checklist

### Phase 1: Create Core Module

- [ ] Create `packages/core/src/modules/{module}/` directory
- [ ] Create `types.ts` with database types
- [ ] Create `errors.ts` with error codes
- [ ] Create `utils.ts` if needed
- [ ] Create `{module}-service.ts` with business logic
- [ ] Create `index.ts` exporting everything
- [ ] Add export to `packages/core/src/index.ts`
- [ ] Run `pnpm typecheck` to verify

### Phase 2: Update Web App

- [ ] Create `{module}-factory.ts` for service instantiation
- [ ] Update `actions.ts` to use factory and call service methods
- [ ] Update `queries.ts` to import types from `@accessly/core`
- [ ] Update `index.ts` to re-export types from core
- [ ] Delete old `types.ts` (now in core)
- [ ] Delete old service file (now in core)
- [ ] Update all imports in components/hooks
- [ ] Run `pnpm typecheck` and `pnpm lint`

### Phase 3: Verify

- [ ] All type checks pass
- [ ] Lint passes
- [ ] Manual testing of affected features
- [ ] Update any tests

## Key Principles

1. **Core is framework-agnostic**: No React, Next.js, or web-specific code
2. **Result types for error handling**: Use `ok()` and `err()` from `@accessly/core`
3. **Dependency injection**: Services receive dependencies via constructor
4. **Type inference**: Don't add explicit return types to service methods
5. **Re-export types**: Web app re-exports types from core for convenience
6. **Thin actions**: Server actions just create service and call methods

## See Also

- [Result Types and Error Codes](./core-result-and-error-design.md)
