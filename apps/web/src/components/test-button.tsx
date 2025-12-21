'use client';

import { Button } from './ui/button';
// import { SupabaseCSRClient } from "@/lib/supabase/client";
// import { getUserId } from "@/lib/auth";

export function TestButton() {
  return (
    <Button
      onClick={async () => {
        try {
          const res = await fetch('/api/test/get-user-orgs');
          const json = await res.json();
          console.log('user orgs:', json);
          alert(JSON.stringify(json));
        } catch (err) {
          console.error('failed to fetch user orgs', err);
          alert('failed to fetch user orgs');
        }
      }}
    >
      Test
    </Button>
  );
}
