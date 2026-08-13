"use client";

import { useState, useRef } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: "image" | "video" | "both";
  /** Kept for API compatibility — no longer enforced */
  maxWidth?: number;
  /** Kept for API compatibility — no longer enforced */
  maxHeight?: number;
  /** Kept for API compatibility — no longer enforced */
  maxSizeMB?: number;
  /** Kept for API compatibility — no longer enforced */
  aspectRatio?: string;
  uploadType?: "icon" | "image";
}

export function MediaUpload({
  value,
  onChange,
  accept = "both",
  maxWidth: _maxWidth,
  maxHeight: _maxHeight,
  maxSizeMB: _maxSizeMB,
  aspectRatio: _aspectRatio,
  uploadType = "image",
}: MediaUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    if (accept === "image") {
      return uploadType === "icon" ? "image/*,.ico" : "image/*";
    }
    if (accept === "video") return "video/*";
    return "image/*,video/*";
  };

  const getAllowedTypes = () => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (accept === "image") {
      if (uploadType === "icon") {
        return [...imageTypes, "image/x-icon", "image/vnd.microsoft.icon"];
      }
      return imageTypes;
    }
    if (accept === "video") return ["video/mp4", "video/webm", "video/ogg"];
    return ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = getAllowedTypes();
    const isIcoByName = uploadType === "icon" && /\.ico$/i.test(file.name);
    const typeOk = allowedTypes.includes(file.type) || isIcoByName;

    if (!typeOk) {
      const accepted =
        uploadType === "icon"
          ? "PNG, ICO, JPEG, WebP, GIF"
          : allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ");
      return `File type not allowed. Accepted: ${accepted}`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setError("");
    setIsLoading(true);
    setUploadProgress(0);

    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      setIsLoading(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          onChange(result.url);
          setError("");
          setIsLoading(false);
          setUploadProgress(0);
          clearInterval(progressInterval);
        }, 200);
      } else {
        setError(result.error || "Upload failed");
        setIsLoading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }
    } catch {
      setError("Upload failed. Please try again.");
      setIsLoading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasFile = Boolean(value);

  return (
    <div className="space-y-1.5">
      {hasFile ? (
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/product-placeholder.svg";
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={isLoading}
            className="admin-action-btn h-7 px-2.5 text-xs"
          >
            <Upload className="mr-1 h-3 w-3" />
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isLoading}
            className="h-7 w-7 shrink-0 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={isLoading}
            className={cn(
              "admin-action-btn h-7 border-dashed px-3 text-xs",
              isLoading && "opacity-70",
            )}
          >
            <Upload className="mr-1 h-3 w-3" />
            {isLoading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      )}

      {isLoading && <Progress value={uploadProgress} className="h-1 max-w-xs" />}

      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
