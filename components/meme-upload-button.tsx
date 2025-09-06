import type { JSX } from "react";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";



interface MemeUploadButtonProps {
  onUpload: (files: File[]) => void;
  onError?: (message: string) => void;
  isUploading: boolean;
}

/**
 * @description
 * Meme upload button component for selecting multiple meme files
 *
 * @param props - The component props
 * @param props.onUpload - Callback when files are selected
 * @param props.onError - Callback for validation errors
 * @param props.isUploading - Whether upload is in progress
 * @returns The meme upload button component
 */
export function MemeUploadButton({ onUpload, onError, isUploading }: MemeUploadButtonProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const maxSize = 4 * 1024 * 1024; // 4MB
    const maxFiles = 10;

    // Validate files
    for (const file of fileArray) {
      if (validFiles.length >= maxFiles) {
        break;
      }

      // Check file size
      if (file.size > maxSize) {
        onError?.(`File "${file.name}" is too large. Maximum size is 4MB.`);
        continue;
      }

      // Check file type
      const extension = file.name.toLowerCase().split(".").pop() || "";
      const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
      const imageExts = ["jpg", "jpeg", "png", "gif", "webp"];

      if (!videoExts.includes(extension) && !imageExts.includes(extension)) {
        onError?.(`File "${file.name}" is not a supported format. Please use images (jpg, jpeg, png, gif, webp) or videos (mp4, webm, mov, avi, mkv).`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 ${
          dragOver ? "bg-purple-600 scale-105" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Memes"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.mp4,.webm,.mov,.avi,.mkv"
        onChange={e => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload hint tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        Drop meme files here or click to browse
        <br />
        Max 10 files, 4MB each
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
}
