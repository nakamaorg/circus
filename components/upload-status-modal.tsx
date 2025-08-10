import type { JSX } from "react";

import { AlertCircle, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";



interface UploadResult {
  success: boolean;
  filename: string;
  key: string;
  error?: string;
}

interface UploadStatusModalProps {
  isOpen: boolean;
  results: UploadResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  onClose: () => void;
}

/**
 * @description
 * Modal component to display upload results and status
 *
 * @param props - The component props
 * @param props.isOpen - Whether the modal is open
 * @param props.results - Array of upload results
 * @param props.summary - Upload summary statistics
 * @param props.onClose - Callback to close the modal
 * @returns The upload status modal component
 */
export function UploadStatusModal({ isOpen, results, summary, onClose }: UploadStatusModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate__animated animate__jackInTheBox animate__fast fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
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

      {/* Modal Content */}
      <div className="animate__animated animate__zoomIn animate__fast relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {summary.failed === 0
              ? <Check className="w-8 h-8 text-green-600" />
              : summary.successful === 0
                ? <X className="w-8 h-8 text-red-600" />
                : <AlertCircle className="w-8 h-8 text-yellow-600" />}
            <div>
              <h2 className="text-2xl font-black text-black uppercase">Upload Results</h2>
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
                files
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="w-10 h-10 p-0 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100"
          >
            <X className="w-5 h-5" />
          </Button>
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
                            Uploaded successfully to
                            {" "}
                            {result.key.includes("videos") ? "videos" : "images"}
                            {" "}
                            folder
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
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold text-gray-600">
              {summary.successful > 0 && (
                <span className="text-green-600">
                  ✓
                  {" "}
                  {summary.successful}
                  {" "}
                  file
                  {summary.successful !== 1 ? "s" : ""}
                  {" "}
                  uploaded successfully
                </span>
              )}
              {summary.failed > 0 && summary.successful > 0 && " • "}
              {summary.failed > 0 && (
                <span className="text-red-600">
                  ✗
                  {" "}
                  {summary.failed}
                  {" "}
                  file
                  {summary.failed !== 1 ? "s" : ""}
                  {" "}
                  failed to upload
                </span>
              )}
            </div>
            <Button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
