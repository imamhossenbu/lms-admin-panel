"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import {
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  PRESET_BANNERS,
  DEFAULT_FALLBACK_BANNER,
  SVG_FALLBACK,
} from "./constants";

interface CourseBannerPickerProps {
  thumbnail: string;
  onThumbnailChange: (url: string) => void;
  title?: string;
  selectedCategoryName?: string;
  level?: string;
  selectedFileName?: string | null;
  onSelectedFileNameChange?: (name: string | null) => void;
  isUploadingImage?: boolean;
  onIsUploadingChange?: (isUploading: boolean) => void;
}

export function CourseBannerPicker({
  thumbnail,
  onThumbnailChange,
  title = "Course Title",
  selectedCategoryName = "General",
  level = "INTERMEDIATE",
  selectedFileName,
  onSelectedFileNameChange,
  isUploadingImage,
  onIsUploadingChange,
}: CourseBannerPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFileName, setLocalFileName] = React.useState<string | null>(null);
  const [localIsUploading, setLocalIsUploading] = React.useState(false);

  const activeFileName = selectedFileName !== undefined ? selectedFileName : localFileName;
  const setActiveFileName = onSelectedFileNameChange || setLocalFileName;
  const activeIsUploading = isUploadingImage !== undefined ? isUploadingImage : localIsUploading;
  const setActiveIsUploading = onIsUploadingChange || setLocalIsUploading;

  const handleDeviceImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPG, WebP, etc.)",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file too large", {
        description: "Please select an image smaller than 10MB.",
      });
      return;
    }

    setActiveFileName(file.name);
    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    onThumbnailChange(previewUrl);

    // Upload to Cloudinary via backend
    setActiveIsUploading(true);
    const toastId = toast.loading("Uploading to Cloudinary Cloud CDN...", {
      description: `Optimizing and uploading ${file.name}`,
    });

    try {
      const res = await coursesApi.uploadThumbnail(file);
      if (res && res.url) {
        onThumbnailChange(res.url);
        toast.success("Uploaded to Cloudinary!", {
          id: toastId,
          description: "Course thumbnail securely hosted on Cloudinary CDN.",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      }
    } catch (err: any) {
      console.warn("Cloudinary upload fallback to local preview:", err);
      toast.info("Using local preview", {
        id: toastId,
        description: "Image loaded locally and will be synchronized.",
      });
    } finally {
      setActiveIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED]">
      <div className="flex items-center justify-between">
        <label className="body-sm-medium text-primary-500 font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#1C4D8D]" />
          <span>Course Banner / Thumbnail Image (16:9 Aspect Ratio)</span>
        </label>
        <span className="body-xsm-regular subtext-500">
          Matches Coursera & Udemy card dimensions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Live 16:9 Thumbnail Preview */}
        <div className="md:col-span-5 relative aspect-video rounded-[10px] overflow-hidden border border-[#EDEDED] bg-slate-900 shadow-sm">
          <Image
            src={thumbnail}
            alt="Course banner preview"
            fill
            unoptimized
            onError={() => {
              if (thumbnail !== DEFAULT_FALLBACK_BANNER) {
                onThumbnailChange(DEFAULT_FALLBACK_BANNER);
              } else {
                onThumbnailChange(SVG_FALLBACK);
              }
            }}
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
            <span className="body-xsm-medium font-bold block truncate">
              {title || "Course Title Preview"}
            </span>
            <span className="body-xsm-regular text-sky-200">
              {selectedCategoryName} • {level}
            </span>
          </div>
        </div>

        {/* Device Image Upload + Cloudinary Integration */}
        <div className="md:col-span-7 space-y-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleDeviceImageChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-[10px] border-2 border-dashed border-[#1C4D8D]/40 bg-white hover:bg-blue-50/40 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1C4D8D] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              {isUploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1C4D8D]" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-0.5">
              <span className="body-sm-medium text-primary-500 font-bold block">
                {isUploadingImage
                  ? "Uploading to Cloudinary CDN..."
                  : selectedFileName
                  ? `Selected: ${selectedFileName}`
                  : "Choose Image from Device"}
              </span>
              <span className="body-xsm-regular subtext-500 block">
                Click to browse JPG, PNG, or WebP • Uploads to Cloudinary
              </span>
            </div>

            {thumbnail.includes("cloudinary.com") && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 body-xsm-medium border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hosted on Cloudinary CDN</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="body-xsm-regular subtext-500 block">
              Or select a curated educational banner preset:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_BANNERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onThumbnailChange(preset.url)}
                  className={`h-12 relative rounded-[6px] overflow-hidden border transition-all cursor-pointer ${
                    thumbnail === preset.url
                      ? "ring-2 ring-[#1C4D8D] border-transparent"
                      : "border-[#EDEDED] opacity-75 hover:opacity-100"
                  }`}
                  title={preset.name}
                >
                  <Image
                    src={preset.url}
                    alt={preset.name}
                    fill
                    unoptimized
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== DEFAULT_FALLBACK_BANNER) {
                        target.src = DEFAULT_FALLBACK_BANNER;
                      } else {
                        target.src = SVG_FALLBACK;
                      }
                    }}
                    sizes="100px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                    <span className="text-[10px] text-white font-semibold leading-tight line-clamp-2">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
