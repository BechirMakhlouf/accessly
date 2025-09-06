import { NextResponse } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email as string | undefined;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: { message: "Invalid email" } }, { status: 400 });
    }

    const supabase = await createSSRClient();
    const res = await supabase.auth.updateUser({ email });

    if (res.error) {
      return NextResponse.json({ error: { message: res.error.message || "Failed to update email" } }, { status: 400 });
    }

    return NextResponse.json({ data: res.data ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
