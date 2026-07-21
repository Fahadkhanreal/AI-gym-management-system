import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

const ALTER_COMMANDS = [
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS source text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS message text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS fitness_goal text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS experience_level text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_time text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS days_per_week integer`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS consented boolean DEFAULT false`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS status text DEFAULT 'new'`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS age integer`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender text DEFAULT ''`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now()`,
];

export async function POST(request: Request) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const results: { sql: string; ok: boolean; error?: string }[] = [];

  for (const sql of ALTER_COMMANDS) {
    try {
      const { error } = await supabaseAdmin.rpc("exec_sql", { sql });
      // If rpc fails, try raw query approach
      if (error) {
        results.push({ sql, ok: false, error: error.message });
      } else {
        results.push({ sql, ok: true });
      }
    } catch {
      results.push({ sql, ok: false, error: "exec_sql not available" });
    }
  }

  const successCount = results.filter(r => r.ok).length;

  return NextResponse.json({
    total: ALTER_COMMANDS.length,
    successCount,
    results,
    message: successCount === ALTER_COMMANDS.length
      ? "All columns added successfully! 🙌"
      : "Some columns may already exist or need manual SQL — check results",
    manualSql: successCount !== ALTER_COMMANDS.length
      ? ALTER_COMMANDS.join(";\n") + ";"
      : null,
  });
}
