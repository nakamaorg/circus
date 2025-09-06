"use client";

import type { JSX } from "react";

import { Calendar, Camera, FileText, Hash, Save, Type, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { isHistorian } from "@/lib/helpers/permission.helper";
import { useUser } from "@/lib/hooks/use-user";



interface EventAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  timestamp: string;
  tags: string;
  photo: File | null;
}

/**
 * @description
 * Modal component for adding new events for Historian users
 *
 * @param props - Component props
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Function to close the modal
 * @param props.onSuccess - Function called on successful event creation
 * @returns JSX element
 */
export function EventAddModal({ isOpen, onClose, onSuccess }: EventAddModalProps): JSX.Element | null {
  const { user } = useUser();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    timestamp: "",
    tags: "",
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        timestamp: "",
        tags: "",
        photo: null,
      });
      setError("");
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render if user is not Historian
  if (!user || !isHistorian(user)) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Validate file type - must be an image
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");

        return;
      }

      // Validate file size - max 4MB
      if (file.size > 4 * 1024 * 1024) {
        setError("Image size must be less than 4MB");

        return;
      }
    }

    setFormData(prev => ({ ...prev, photo: file }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Title is required");

      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");

      return false;
    }
    if (!formData.timestamp) {
      setError("Timestamp is required");

      return false;
    }
    if (!formData.photo) {
      setError("Photo is required");

      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Create FormData for the API request
      const submitFormData = new FormData();

      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());
      submitFormData.append("timestamp", Math.round(new Date(formData.timestamp).getTime() / 1000).toString());

      // Process tags - split by comma and clean up
      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      submitFormData.append("tags", JSON.stringify(tags));

      if (formData.photo) {
        submitFormData.append("photo", formData.photo);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to create event");
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        timestamp: "",
        tags: "",
        photo: null,
      });

      onSuccess();
      onClose();
    }
    catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate__animated animate__fadeIn animate__fast fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      {/* NeoBrutalism themed backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

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
        onClick={handleClose}
        disabled={isSubmitting}
        className="animate__animated animate__bounceIn animate__delay-1s fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center group/tooltip disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Close event add modal"
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
      <div className="animate__animated animate__jackInTheBox animate__fast relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 p-6 pb-0">
          <Calendar className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-wide">Add Event</h2>
            <p className="text-sm font-bold text-gray-600">Create a new historical event</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-black text-black uppercase tracking-wider">
              <Type className="w-5 h-5" />
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange("title", e.target.value)}
              placeholder="Enter event title..."
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 text-lg font-bold placeholder-gray-500"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-black text-black uppercase tracking-wider">
              <FileText className="w-5 h-5" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange("description", e.target.value)}
              placeholder="Enter event description..."
              rows={4}
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 text-lg font-bold placeholder-gray-500 resize-vertical"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Timestamp Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-black text-black uppercase tracking-wider">
              <Calendar className="w-5 h-5" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp}
              onChange={e => handleInputChange("timestamp", e.target.value)}
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 text-lg font-bold"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-black text-black uppercase tracking-wider">
              <Hash className="w-5 h-5" />
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas (e.g., tag1, tag2, tag3)"
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 text-lg font-bold placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Photo Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-black text-black uppercase tracking-wider">
              <Camera className="w-5 h-5" />
              Photo
            </label>
            <div className="border-4 border-black border-dashed p-6 text-center bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                disabled={isSubmitting}
                required
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-block bg-blue-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 px-6 py-3 text-lg font-black text-black uppercase tracking-wider"
              >
                <Camera className="w-5 h-5 inline mr-2" />
                {formData.photo ? "Change Photo" : "Select Photo"}
              </label>
              {formData.photo && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-green-700">
                    Selected:
                    {" "}
                    {formData.photo.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Size:
                    {" "}
                    {(formData.photo.size / 1024 / 1024).toFixed(2)}
                    {" "}
                    MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-400 p-4">
              <p className="text-red-700 font-bold text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-gray-400 hover:bg-gray-500 text-black font-black px-6 py-3 text-lg uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-400 hover:bg-green-500 text-black font-black px-6 py-3 text-lg uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
