"use client";

import { createOrg } from "@/modules/organizations/actions";
import { Button } from "./ui/button";
import { getUserId } from "@/lib/supabase/utils";
import { SupabaseCSRClient } from "@/lib/supabase/client";


export function TestButton() {
  return <Button onClick={async () => {
    const userId = await getUserId(SupabaseCSRClient);
    createOrg({
      slug: "myorg",
      created_by: userId!,
      name: "myorg",
      description: "test organization"
    })
  }}>Test</Button>
}
