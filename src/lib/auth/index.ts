// Main auth hook and provider
export { useAuth } from './hooks';
export { AuthProvider, useAuthContextValue } from './provider';

// Client-callable server actions
export {
  updateUserEmail,
  updateUserPhone,
  getUserPhone,
  getUserEmail,
} from './actions';

// Utilities (client-safe)
export {
  extractUserNameFromOAuth,
  extractUserImageFromOAuth,
} from './utils';

// Queries and mutations
export {
  AUTH_USER_KEY,
  signInWithPassword,
  signUp,
  signOut as signOutQuery,
  signInWithOAuth,
  signUpWithOAuth,
  getAuthUser,
  getAuthUserQueryOptions,
  signInMutationOptions,
  signOutMutationOptions,
  signUpMutationOptions,
  signInWithOAuthMutationOptions,
  signUpWithOAuthMutationOptions,
} from './queries';

// Components
export { SignInForm, signInSchema } from './components/sign-in-form';
export { SignUpForm, signUpSchema } from './components/sign-up-form';
export { ForgotPasswordForm } from './components/forgot-password-form';
export { ConfirmEmailCard } from './components/confirm-email-card';
export { UpdatePasswordForm } from './components/update-password-form';
