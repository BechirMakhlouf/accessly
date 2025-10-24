// Server-only auth utilities
// This file should only be imported in server contexts (Server Components, Server Actions, etc.)

export { assertSignedInAndGetUserId } from './server-utils';
export { getUserId } from './utils';
export { 
  signOut,
  signInWithOAuthAction,
  isAuthenticated,
  updateUserEmail,
  updateUserPhone,
  getUserPhone,
  getUserEmail,
} from './actions';
export { authMiddleware } from './middleware';
