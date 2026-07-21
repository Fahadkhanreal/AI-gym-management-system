import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
      ALTER TABLE transformations
        ADD COLUMN IF NOT EXISTS before_image_url text DEFAULT '',
        ADD COLUMN IF NOT EXISTS after_image_url text DEFAULT '';
    `,
  });

  if (error) {
    // Fallback: try raw query via REST
    const { error: directError } = await supabaseAdmin
      .from("transformations")
      .update({ before_image_url: "" })
      .eq("id", "00000000-0000-0000-0000-000000000000");

    if (directError && directError.message?.includes("column")) {
      // Try to run via direct SQL if exec_sql not available
      const { error: rpcError } = await supabaseAdmin.rpc("exec", {
        query: `
          ALTER TABLE transformations
            ADD COLUMN IF NOT EXISTS before_image_url text DEFAULT '',
            ADD COLUMN IF NOT EXISTS after_image_url text DEFAULT '';
        `,
      });
      if (rpcError) {
        return NextResponse.json({
          error: "Migration failed — run this SQL in Supabase SQL Editor:",
          sql: `
ALTER TABLE transformations
  ADD COLUMN IF NOT EXISTS before_image_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS after_image_url text DEFAULT '';
          `,
        }, { status: 400 });
      }
    }
  }

  return NextResponse.json({ success: true, message: "Migration complete! Columns added." });
}
