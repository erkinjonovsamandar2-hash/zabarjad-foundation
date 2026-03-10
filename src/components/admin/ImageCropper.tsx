import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Crop as CropIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageCropperProps {
  currentUrl: string;
  onImageSaved: (url: string) => void;
  aspectRatio?: number; // e.g. 2/3 for book covers, 16/9 for blog
  label?: string;
}

const ImageCropper = ({ currentUrl, onImageSaved, aspectRatio = 2 / 3, label = "Rasm" }: ImageCropperProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidth = Math.min(width, height * (aspectRatio || 1));
    const cropHeight = cropWidth / (aspectRatio || 1);
    setCrop({
      unit: "px",
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    });
  }, [aspectRatio]);

  const getCroppedBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop) { resolve(null); return; }
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX, completedCrop.y * scaleY,
        completedCrop.width * scaleX, completedCrop.height * scaleY,
        0, 0, canvas.width, canvas.height
      );
      canvas.toBlob((blob) => resolve(blob), "image/webp", 0.85);
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const blob = await getCroppedBlob();
      if (!blob) return;

      const fileName = `${Date.now()}-${crypto.randomUUID() || Math.random().toString(36).slice(2)}.webp`;

      const { data, error } = await supabase.storage
        .from("books")
        .upload(fileName, blob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        alert("Rasm yuklashda xatolik: " + error.message);
        throw new Error(error.message);
      }

      // Get the full public URL from Supabase
      const { data: urlData } = supabase.storage.from("books").getPublicUrl(data.path);

      // Save the complete HTTP URL to the database
      onImageSaved(urlData.publicUrl);
      setSrc(null);
    } catch (err: any) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground/80 mb-1">{label}</label>

      {/* Current preview */}
      {currentUrl && !src && (
        <div className="mb-2 relative inline-block">
          <img src={currentUrl} alt="" className="h-24 rounded-lg object-cover border border-gray-200" />
          <button onClick={() => onImageSaved("")} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
        </div>
      )}

      {/* File picker */}
      {!src && (
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
          <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-muted-foreground hover:border-amber-400 hover:text-primary transition-colors">
            <Upload className="h-4 w-4" /> Rasm yuklash
          </button>
        </div>
      )}

      {/* Crop UI */}
      {src && (
        <div className="space-y-3">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={aspectRatio}>
            <img ref={imgRef} src={src} onLoad={onImageLoad} className="max-h-64 rounded-lg" alt="Crop" />
          </ReactCrop>
          <div className="flex gap-2">
            <button onClick={handleUpload} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <CropIcon className="h-4 w-4" /> {uploading ? "Yuklanmoqda..." : "Kesib saqlash"}
            </button>
            <button onClick={() => setSrc(null)} className="px-4 py-2 text-sm text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors">Bekor qilish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
