import type { JSX } from "react";

import { MapPin, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";



interface FieldAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * @description
 * Modal component for adding new fields
 * Allows users with Fenjer permissions to add new football fields
 *
 * @param props - The component props
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Callback to close the modal
 * @param props.onSuccess - Optional callback called after successful field creation
 * @returns The field add modal component
 */
export function FieldAddModal({ isOpen, onClose, onSuccess }: FieldAddModalProps): JSX.Element | null {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName("");
      setLocation("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError("Field name is required");
      setIsSubmitting(false);

      return;
    }

    if (!location.trim()) {
      setError("Field location is required");
      setIsSubmitting(false);

      return;
    }

    // Validate location format (should be a URL)
    try {
      const url = new URL(location.trim());

      // Just check that we can create a URL object
      if (!url.protocol) {
        throw new Error("Invalid URL");
      }
    }
    catch {
      setError("Please enter a valid URL for the location");
      setIsSubmitting(false);

      return;
    }

    try {
      // Call the API route to create the field
      const response = await fetch("/api/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create field");
      }

      // Success - close modal
      onSuccess?.();
      onClose();
    }
    catch (fetchError) {
      console.error("Failed to create field:", fetchError);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to create field");
    }
    finally {
      setIsSubmitting(false);
    }
  };

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
        aria-label="Close field add modal"
      >
        <X className="h-6 w-6" />
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] pointer-events-none">
          Close (Esc)
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-black"></div>
        </div>
      </button>

      {/* Modal Content */}
      <div className="animate__animated animate__jackInTheBox animate__fast relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-wide">Add Field</h2>
            <p className="text-sm font-bold text-gray-600">Create a new football field</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Field Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter field name..."
              className="w-full px-4 py-3 text-black bg-white border-4 border-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 outline-none"
              required
            />
          </div>

          {/* Location URL */}
          <div>
            <label htmlFor="location" className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location URL
            </label>
            <input
              id="location"
              type="url"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-4 py-3 text-black bg-white border-4 border-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 outline-none"
              required
            />
            <p className="text-xs font-bold text-gray-600 mt-1">
              Paste a Google Maps link or any URL to the field location
            </p>
          </div>

          {error && (
            <div className="animate__animated animate__shakeX bg-red-100 border-4 border-red-600 p-4">
              <p className="text-red-800 font-bold text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-black border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:translate-x-0 disabled:translate-y-0 transition-all duration-100"
            >
              {isSubmitting
                ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  )
                : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </>
                  )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
