"use client";

import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoUpload({
  imageUrl,
  onUpload,
  onClear,
}: {
  imageUrl: string | null;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) onUpload(result);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (imageUrl) {
    return (
      <div className="relative overflow-hidden rounded-lg border">
        <img
          src={imageUrl}
          alt="Uploaded roof photo"
          className="h-64 w-full object-cover"
        />
        <button
          onClick={onClear}
          className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={cn(
        "flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        dragActive
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      )}
    >
      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3">
        <div className="rounded-full bg-gray-100 p-3">
          {dragActive ? (
            <ImageIcon size={24} className="text-emerald-500" />
          ) : (
            <Upload size={24} className="text-gray-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {dragActive ? "Drop your photo here" : "Upload a roof photo"}
          </p>
          <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
