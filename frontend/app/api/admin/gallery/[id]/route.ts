import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  // Fetch the gallery record to get the image URL
  const { data: record, error: fetchError } = await supabaseAdmin
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
  }

  // Extract filename from URL and delete from Storage
  if (record.image_url) {
    const urlParts = record.image_url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (fileName) {
      await supabaseAdmin.storage.from("gallery").remove([fileName]);
    }
  }

  // Delete database record
  const { error } = await supabaseAdmin
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
