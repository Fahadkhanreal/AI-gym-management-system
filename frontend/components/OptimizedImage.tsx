import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  fill = true,
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  containerClassName,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) return null;

  // Use next/image for Supabase storage URLs and relative paths
  if (src.startsWith("http") || src.startsWith("/")) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)} style={!fill ? { width, height } : undefined}>
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={cn("object-cover", className)}
          priority={priority}
          sizes={fill ? sizes : undefined}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Fallback for data URIs or other formats
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
