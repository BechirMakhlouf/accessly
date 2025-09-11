import { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export async function getUserId(supabase: SupabaseClient) {
  // Prefer JWT claims (fast) then fall back to getUser(). Always return null on failure.
  try {
    const { data: claimsData, error: claimsError } = await supabase.auth
      .getClaims();
    if (!claimsError) {
      const sub = claimsData?.claims?.sub;
      if (sub) return sub;
    }
  } catch (e) {
    console.debug("error while getting user claims: ", e);
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.info("error while getting user: ", error);
    } else if (data) {
      return data.user.id;
    }
  } catch (e) {
    console.error("error while calling getUser():", e);
  }

  return null;
}

/**
 * Extracts the user's full name from OAuth provider metadata
 * Different providers store names in different fields
 */
export function extractUserNameFromOAuth(user: User): string | null {
  const metadata = user.user_metadata;
  if (!metadata) return null;

  // Try different common fields where providers store the full name
  const possibleNameFields = [
    "full_name",
    "name",
    "display_name",
    "preferred_username",
    "given_name",
    "family_name",
  ];

  // First, try to find a full name directly
  for (const field of possibleNameFields) {
    if (metadata[field] && typeof metadata[field] === "string") {
      return metadata[field].trim();
    }
  }

  // If no full name found, try to construct from first and last name
  const firstName = metadata.given_name || metadata.first_name ||
    metadata.firstname;
  const lastName = metadata.family_name || metadata.last_name ||
    metadata.lastname;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  // If only first name is available, use it
  if (firstName) {
    return firstName.trim();
  }

  // If only last name is available, use it
  if (lastName) {
    return lastName.trim();
  }

  return null;
}

/**
 * Extracts the user's avatar/image URL from OAuth provider metadata
 * Different providers store avatar URLs in different fields
 */
export function extractUserImageFromOAuth(user: User): string | null {
  const metadata = user.user_metadata;
  if (!metadata) return null;

  // Try different common fields where providers store avatar URLs
  const possibleImageFields = [
    "avatar_url", // GitHub, Slack
    "picture", // Google, Microsoft
    "photo", // Some providers
    "profile_picture", // Some providers
    "image", // Some providers
    "profile_image", // Some providers
  ];

  for (const field of possibleImageFields) {
    if (metadata[field] && typeof metadata[field] === "string") {
      const url = metadata[field].trim();
      // Basic URL validation
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
    }
  }

  return null;
}

