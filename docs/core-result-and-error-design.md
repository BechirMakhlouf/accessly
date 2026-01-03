# Core Package: Result Types and Error Codes

This document describes the design decisions for handling results and errors in `@accessly/core`.

## Goals

1. **Type-safe error handling**: Consumers know exactly which errors a method can return
2. **No manual type definitions per method**: Error types are inferred from the implementation
3. **i18n-compatible error codes**: Error codes map directly to translation keys
4. **Simple consumer experience**: Just call the method, check the result, handle errors
5. **Clean type display**: Error unions collapse into readable `Result<T, E1 | E2 | E3>` format

## Result Type

### Core Types

```typescript
// packages/core/src/types/result.ts

export type Ok<T> = { data: T; error: null };
export type Err<E extends string> = { data: null; error: E };
export type Result<T, E extends string> = Ok<T> | Err<E>;
```

### Helper Functions

```typescript
export function ok<T>(data: T): Ok<T> {
  return { data, error: null };
}

export function err<E extends string>(error: E): Result<never, E> {
  return { data: null, error };
}
```

### Design Decisions

#### 1. Why `ok()` and `err()` Helpers?

- **Preserves literal types**: TypeScript infers `"org.notFound"` instead of `string`
- **Consistent shape**: Both success and error cases have `data` and `error` properties
- **Less boilerplate**: Cleaner than `return { data: null, error: OrgErrors.notFound }`

#### 2. Why `ok()` Returns `Ok<T>` and `err()` Returns `Result<never, E>`?

This is a key design decision for clean type display.

**The Problem**: If `err()` returned `Err<E>`, TypeScript would show:

```typescript
Promise<
  | Ok<Organization>
  | Err<"org.unauthorized">
  | Err<"org.slugAlreadyExists">
  | Err<"org.failedToUpdate">
>;
```

**The Solution**: By having `err()` return `Result<never, E>`, TypeScript collapses error types:

```typescript
Promise<
  Result<
    Organization,
    "org.unauthorized" | "org.slugAlreadyExists" | "org.failedToUpdate"
  >
>;
```

The `never` type in `Result<never, E>` acts as an identity element - when unioned with `Ok<T>`, the `never` disappears and all error types merge into a single `E` parameter.

#### 3. Why No Explicit Return Type Annotations?

```typescript
// DO THIS - let TypeScript infer
async getBySlug(slug: string) {
  // ...
}

// NOT THIS - manual annotation defeats the purpose
async getBySlug(slug: string): Promise<Result<Organization, OrgError>> {
  // ...
}
```

Benefits of inference:

- Error types are always accurate (derived from actual `err()` calls)
- No need to maintain separate error type unions per method
- Adding/removing error cases automatically updates the type
- TypeScript catches unreachable error handling code

### Service Method Pattern

```typescript
async getBySlug(slug: string) {
  if (!slug) {
    return err(OrgErrors.notFound);
  }

  const { data, error } = await this.supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to get organization by slug:", error);
    return err(OrgErrors.failedToLoad);
  }

  if (!data) {
    return err(OrgErrors.notFound);
  }

  return ok(data);
}
```

TypeScript infers:

```typescript
Promise<Result<Organization, "org.notFound" | "org.failedToLoad">>;
```

### Consumer Experience

```typescript
const result = await orgService.getBySlug("my-org");

if (result.error) {
  // TypeScript knows: result.error is "org.notFound" | "org.failedToLoad"

  switch (result.error) {
    case "org.notFound":
      return notFound();
    case "org.failedToLoad":
      return serverError();
  }
}

// TypeScript knows: result.data is Organization
console.log(result.data.name);
```

Benefits:

- No need to import error types
- IDE autocomplete shows only valid error codes for this method
- TypeScript warns if you check for an impossible error code
- Exhaustive switch statements are enforced

## Error Codes

### Structure

Error codes use dot-notation that maps directly to i18n translation keys:

```
module.errorName
module.submodule.errorName
```

Examples:

- `org.notFound` → `t("org.notFound")` → "Organization not found"
- `org.members.failedToLoad` → `t("org.members.failedToLoad")` → "Failed to load organization members"

### Module Error Definitions

Each module defines its error codes as a const object:

```typescript
// packages/core/src/modules/organizations/errors.ts

export const OrgErrors = {
  notFound: "org.notFound",
  failedToLoad: "org.failedToLoad",
  failedToCreate: "org.failedToCreate",
  failedToUpdate: "org.failedToUpdate",
  failedToDelete: "org.failedToDelete",
  unauthorized: "org.unauthorized",
  slugAlreadyExists: "org.slugAlreadyExists",
} as const;

export const OrgMemberErrors = {
  failedToLoad: "org.members.failedToLoad",
  failedToUpdate: "org.members.failedToUpdate",
  failedToRemove: "org.members.failedToRemove",
  unauthorized: "org.members.unauthorized",
  insufficientPermissions: "org.members.insufficientPermissions",
} as const;

// Union type for all org-related errors (useful for i18n type checking)
export type OrgError = (typeof OrgErrors)[keyof typeof OrgErrors];
export type OrgMemberError =
  (typeof OrgMemberErrors)[keyof typeof OrgMemberErrors];
```

### Common Errors

Errors shared across modules live in the core types:

```typescript
// packages/core/src/types/errors.ts

export const CommonErrors = {
  unauthorized: "common.unauthorized",
  networkError: "common.networkError",
  validationFailed: "common.validationFailed",
  unexpectedError: "common.unexpectedError",
} as const;

export type CommonError = (typeof CommonErrors)[keyof typeof CommonErrors];
```

### i18n Mapping

The web app's translation files must include keys matching the error codes:

```json
// apps/web/messages/en.json
{
  "common": {
    "unauthorized": "You are not authorized to perform this action",
    "networkError": "A network error occurred",
    "validationFailed": "Validation failed",
    "unexpectedError": "An unexpected error occurred"
  },
  "org": {
    "notFound": "Organization not found",
    "failedToLoad": "Failed to load organization",
    "members": {
      "failedToLoad": "Failed to load organization members"
    }
  }
}
```

Usage in components:

```typescript
const t = useTranslations();

if (result.error) {
  toast.error(t(result.error));
}
```

## Utility Types

### InferErrors and InferData

For cases where you need to extract types programmatically:

```typescript
export type InferErrors<T> = T extends { error: infer E }
  ? E extends null
    ? never
    : E
  : never;

export type InferData<T> = T extends { data: infer D }
  ? D extends null
    ? never
    : D
  : never;
```

Usage:

```typescript
type GetBySlugResult = Awaited<ReturnType<typeof orgService.getBySlug>>;
type GetBySlugErrors = InferErrors<GetBySlugResult>;
// => "org.notFound" | "org.failedToLoad"

type GetBySlugData = InferData<GetBySlugResult>;
// => Organization
```

These are primarily for internal tooling or advanced type manipulation - consumers typically don't need them.

## File Structure

```
packages/core/src/
  types/
    result.ts           # ok(), err() helpers and Result types
    errors.ts           # CommonErrors
    index.ts            # exports
  modules/
    organizations/
      errors.ts         # OrgErrors, OrgMemberErrors, etc.
      organization-service.ts  # uses ok(), err()
```

## Migration Guide

### Before

```typescript
import type { ServiceResult } from "@/types/service-result";

async getBySlug(slug: string): Promise<ServiceResult<Organization>> {
  if (!slug) {
    return { error: OrgErrors.notFound };
  }
  // ...
  return { data };
}
```

### After

```typescript
import { ok, err } from "../../types/result";

async getBySlug(slug: string) {
  if (!slug) {
    return err(OrgErrors.notFound);
  }
  // ...
  return ok(data);
}
```

Key changes:

1. Remove explicit return type annotation - let TypeScript infer
2. Use `ok(data)` for success returns
3. Use `err(ErrorCode)` for error returns
4. Import `ok` and `err` from the result module
5. Use relative imports in the core package (not `@/` aliases)

## Summary of Design Decisions

| Decision                            | Rationale                                          |
| ----------------------------------- | -------------------------------------------------- |
| `ok()` returns `Ok<T>`              | Explicit success type for clarity                  |
| `err()` returns `Result<never, E>`  | Enables TypeScript to collapse error unions        |
| No explicit return type annotations | Errors are always derived from implementation      |
| Dot-notation error codes            | Direct mapping to i18n translation keys            |
| Error objects with `as const`       | Preserves literal string types                     |
| Relative imports in core package    | Ensures proper resolution when consumed externally |
