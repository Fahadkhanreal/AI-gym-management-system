"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Trash2, Upload, Loader2 } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
  caption: string;
  is_active: boolean;
}

export default function GalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    const token = getToken();
    const res = await fetch("/api/admin/gallery", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);
    if (category) formData.append("category", category);
    if (caption) formData.append("caption", caption);

    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setUploading(false);
    setCategory("");
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this image? (Also removes from storage)")) return;
    const token = getToken();
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Gallery</h1>
        <p className="text-sm text-muted mt-1">Manage gym images</p>
      </div>

      {/* Upload */}
      <div className="glass rounded-2xl p-5 border border-white/5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Category (e.g., equipment, facilities)" value={category} onChange={e => setCategory(e.target.value)} className="input-field" />
            <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} className="input-field" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-4 py-2.5 text-sm disabled:opacity-50 transition-all"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 border border-white/5 text-center">
          <ImageIcon className="size-10 text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-muted">No images yet. Upload your first gym photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group glass rounded-xl overflow-hidden border border-white/5">
              <div className="aspect-[4/3] relative overflow-hidden bg-surface-light">
                <OptimizedImage src={item.image_url} alt={item.caption || "Gallery"} containerClassName="size-full group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={() => deleteItem(item.id)}
                  className="absolute top-2 right-2 flex items-center justify-center size-8 rounded-lg bg-black/60 text-white/80 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {(item.category || item.caption) && (
                <div className="p-3">
                  {item.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan">{item.category}</span>}
                  {item.caption && <p className="text-xs text-muted mt-1 truncate">{item.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


