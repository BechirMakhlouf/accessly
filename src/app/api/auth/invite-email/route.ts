
import { NextResponse } from "next/server";
import { getFullRoute, routes } from "@/lib/routes";
import { createSSRClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/adminClient";
import { OrganizationService } from "@/modules/organizations/organization.service";

export async function GET(request: Request) {
  console.log("[auth] Invite email callback route hit:", request.url);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("[auth] Invite email error:", error, errorDescription);
    return NextResponse.redirect(
      getFullRoute(routes.auth.authCodeError, { 
        error: error,
        description: errorDescription || "Unknown error"
      })
    );
  }

  if (!code) {
    console.error("[auth] No code provided in invite email callback");
    return NextResponse.redirect(
      getFullRoute(routes.auth.authCodeError, { 
        error: "missing_code",
        description: "No authorization code provided"
      })
    );
  }

  try {
    const supabase = await createSSRClient();
    const supabaseAdmin = await createAdminClient();

    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("[auth] Session exchange error:", sessionError);
      return NextResponse.redirect(
        getFullRoute(routes.auth.authCodeError, { 
          error: sessionError.code || "session_error",
          description: sessionError.message
        })
      );
    }

    if (!sessionData.user) {
      console.error("[auth] No user data in session");
      return NextResponse.redirect(
        getFullRoute(routes.auth.authCodeError, { 
          error: "no_user",
          description: "No user data found in session"
        })
      );
    }

    // Extract invitation data from user metadata
    const userMetadata = sessionData.user.user_metadata;
    const organizationId = userMetadata?.organization_id;
    const role = userMetadata?.role;

    if (!organizationId || !role) {
      console.error("[auth] Missing invitation data:", { organizationId, role });
      return NextResponse.redirect(
        getFullRoute(routes.auth.authCodeError, { 
          error: "missing_invitation_data",
          description: "Invalid invitation data"
        })
      );
    }

    // Create organization service instance
    const orgService = new OrganizationService({
      supabase,
      adminSupabase: supabaseAdmin,
      userId: sessionData.user.id
    });

    // Add user to organization
    const result = await orgService.addMemberToOrganization(organizationId, role);

    if (result.error) {
      console.error("[auth] Failed to add user to organization:", result.error);
      return NextResponse.redirect(
        getFullRoute(routes.auth.authCodeError, { 
          error: "org_join_failed",
          description: "Failed to join organization"
        })
      );
    }

    // Clear the invitation metadata from user
    await supabaseAdmin.auth.admin.updateUserById(sessionData.user.id, {
      user_metadata: {
        ...userMetadata,
        organization_id: undefined,
        role: undefined,
      }
    });

    // Get organization slug for redirect
    const { data: orgData } = await supabaseAdmin
      .from("organizations")
      .select("slug")
      .eq("id", organizationId)
      .single();

    const redirectPath = orgData?.slug 
      ? routes.protected.dashboard.org.slug.root(orgData.slug)
      : routes.protected.dashboard.root;

    console.log("[auth] Successfully processed invitation, redirecting to:", redirectPath);
    return NextResponse.redirect(new URL(redirectPath, request.url));

  } catch (error) {
    console.error("[auth] Unexpected error in invite email handler:", error);
    return NextResponse.redirect(
      getFullRoute(routes.auth.authCodeError, { 
        error: "unexpected_error",
        description: "An unexpected error occurred"
      })
    );
  }
}