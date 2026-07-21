"use client";
import { getToken } from "@/lib/session";

import { useState, useCallback, useRef, useMemo } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, ZoomIn, ZoomOut, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";

interface ImageCropperModalProps {
  file: File;
  aspect?: number;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else resolve(null);
      },
      "image/webp",
      0.6
    );
  });
}

function ImageCropperModal({ file, aspect = 3 / 2, onCropComplete, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const pixelCropRef = useRef<Area | null>(null);
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    pixelCropRef.current = croppedAreaPixels;
  }, []);

  const handleCrop = useCallback(async () => {
    if (!pixelCropRef.current) return;
    setCropping(true);
    try {
      const croppedBlob = await getCroppedImg(imageUrl, pixelCropRef.current);
      if (croppedBlob) onCropComplete(croppedBlob);
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      console.error("Crop error:", err);
    }
    setCropping(false);
  }, [imageUrl, onCropComplete]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">Adjust Image</h3>
              <p className="text-xs text-muted mt-0.5">Drag to reposition • Scroll to zoom</p>
            </div>
            <button onClick={onCancel} className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>

          {/* Cropper */}
          <div className="relative w-full" style={{ height: "400px" }}>
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaChange}
              objectFit="contain"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 gap-4">
            <div className="flex items-center gap-3 flex-1">
              <ZoomOut className="size-4 text-muted shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-cyan h-1.5 cursor-pointer"
              />
              <ZoomIn className="size-4 text-muted shrink-0" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onCancel} className="px-4 py-2 text-sm text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCrop}
                disabled={cropping}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan text-black font-semibold text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-colors"
              >
                {cropping ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {cropping ? "Processing..." : "Apply & Upload"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface ImagePickerCropProps {
  currentImage?: string;
  aspect?: number;
  folder?: string;
  onImageChange: (url: string) => void;
}

export default function ImagePickerCrop({ currentImage, aspect = 3 / 2, folder = "benefits", onImageChange }: ImagePickerCropProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setPendingFile(null);
    setUploading(true);
    const token = getToken();
    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped.webp");
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.url) onImageChange(data.url);
    else console.error("Upload failed");
    setUploading(false);
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Card Image</label>
        <div className="flex items-start gap-4">
          <div className="size-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
            {currentImage ? (
              <OptimizedImage src={currentImage} alt="Preview" containerClassName="size-full" />
            ) : (
              <div className="text-muted/30 text-center p-2">
                <svg className="size-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[10px]">Preview</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-xl bg-cyan/10 text-cyan border border-cyan/20 px-4 py-2 text-sm hover:bg-cyan/20 disabled:opacity-50 transition-colors">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
              {uploading ? "Uploading..." : "Choose Photo"}
            </button>
            <p className="text-[11px] text-muted/50">Click to select • Then adjust crop</p>
            {currentImage && (
              <button type="button" onClick={() => onImageChange("")} className="text-xs text-red-400 hover:text-red-300 block">Remove</button>
            )}
          </div>
        </div>
      </div>

      {pendingFile && (
        <ImageCropperModal
          file={pendingFile}
          aspect={aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 15V5" />
    </svg>
  );
}


