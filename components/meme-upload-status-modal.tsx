import type { JSX } from "react";

import { AlertCircle, Check, X } from "lucide-react";
import { useEffect } from "react";



interface MemeUploadResult {
  success: boolean;
  filename: string;
  key: string;
  error?: string;
}

interface MemeUploadStatusModalProps {
  isOpen: boolean;
  results: MemeUploadResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  onClose: () => void;
}

/**
 * @description
 * Modal component to display meme upload results and status
 *
 * @param props - The component props
 * @param props.isOpen - Whether the modal is open
 * @param props.results - Array of meme upload results
 * @param props.summary - Upload summary statistics
 * @param props.onClose - Callback to close the modal
 * @returns The meme upload status modal component
 */
export function MemeUploadStatusModal({ isOpen, results, summary, onClose }: MemeUploadStatusModalProps): JSX.Element | null {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate__animated animate__fadeIn animate__fast fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      {/* NeoBrutalism themed backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* NeoBrutalism pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-black"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 40px
            )`,
          }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="animate__animated animate__bounceIn animate__delay-1s fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center group/tooltip"
        aria-label="Close meme upload results"
      >
        <X className="h-6 w-6" />
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] pointer-events-none">
          Close results (Esc)
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-black"></div>
        </div>
      </button>

      {/* Modal Content */}
      <div className="animate__animated animate__jackInTheBox animate__fast relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {summary.failed === 0
            ? <Check className="w-8 h-8 text-green-600" />
            : summary.successful === 0
              ? <X className="w-8 h-8 text-red-600" />
              : <AlertCircle className="w-8 h-8 text-yellow-600" />}
          <div>
            <h2 className="text-2xl font-black text-black uppercase">Meme Upload Results</h2>
            <p className="text-sm font-bold text-gray-600">
              {summary.successful}
              {" "}
              successful,
              {" "}
              {summary.failed}
              {" "}
              failed out of
              {" "}
              {summary.total}
              {" "}
              meme files
            </p>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  result.success
                    ? "bg-green-100 border-green-500"
                    : "bg-red-100 border-red-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success
                    ? <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    : <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black truncate">{result.filename}</p>
                    {result.success
                      ? (
                          <p className="text-sm font-bold text-green-700">
                            Meme uploaded successfully to
                            {" "}
                            {result.key.includes("videos") ? "videos" : "images"}
                            {" "}
                            lore folder
                          </p>
                        )
                      : (
                          <p className="text-sm font-bold text-red-700">
                            {result.error || "Upload failed"}
                          </p>
                        )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-black">
          <div className="text-sm font-bold text-gray-600 text-center">
            {summary.successful > 0 && (
              <span className="text-green-600">
                ✓
                {" "}
                {summary.successful}
                {" "}
                meme file
                {summary.successful !== 1 ? "s" : ""}
                {" "}
                uploaded successfully
              </span>
            )}
            {summary.failed > 0 && summary.successful > 0 && (
              <span className="text-gray-500"> • </span>
            )}
            {summary.failed > 0 && (
              <span className="text-red-600">
                ✗
                {" "}
                {summary.failed}
                {" "}
                meme file
                {summary.failed !== 1 ? "s" : ""}
                {" "}
                failed to upload
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
