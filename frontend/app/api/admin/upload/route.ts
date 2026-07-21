import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    // Try to create bucket if it doesn't exist
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.id === "gallery");

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket("gallery", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
      });
      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // WebP blob mein type empty aa sakta hai — fix
    const fileType = file.type || "image/webp";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: `Only images are allowed, got: ${fileType}` }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    const fileExt = "webp";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, fileBuffer, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("gallery")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl, fileName });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
