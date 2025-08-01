"use client";

import type { JSX } from "react";

import { Calendar, Eye, FileText, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/hooks/use-user";



/**
 * @description
 * Client component for the profile page content using reusable buttons
 *
 * @returns The profile content component
 */
export function ProfileContent(): JSX.Element {
  const { data: session } = useSession();
  const { user: userData, isLoading } = useUser();
  const sessionUser = session?.user;
  const [showBountyPoster, setShowBountyPoster] = useState(false);
  const [bountyImageUrl, setBountyImageUrl] = useState<string | null>(null);
  const [loadingBountyImage, setLoadingBountyImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleViewBounty = async () => {
    if (!userData?.id) {
      return;
    }

    setLoadingBountyImage(true);
    setShowBountyPoster(true);
    setImageLoading(true);

    try {
      const response = await fetch(`/api/bounty-image?userId=${userData.id}`);
      const data = await response.json();

      if (data.success && data.imageUrl) {
        setBountyImageUrl(data.imageUrl);
      }
      else {
        throw new Error("No bounty poster found");
      }
    }
    catch (error) {
      console.error("Failed to load bounty image:", error);
      setShowBountyPoster(false);
      // TODO: Add proper toast notification instead of alert
      // eslint-disable-next-line no-alert
      alert("No bounty poster found for this user");
    }
    finally {
      setLoadingBountyImage(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!session || !sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl font-black text-black">No user session found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-cyan-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          User Profile
        </h1>
        <p className="text-xl md:text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          Your account information
        </p>
      </div>

      {/* Profile Information */}
      <div className="w-full relative">
        {/* Floating Avatar */}
        <div className="absolute -top-8 md:-top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-black bg-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {sessionUser.image
                ? (
                    <img
                      alt={`${sessionUser.name}'s avatar`}
                      className="w-full h-full object-cover"
                      src={sessionUser.image}
                    />
                  )
                : (
                    <div className="w-full h-full bg-purple-300 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
            </div>
            {/* Status Badge */}
            {userData?.wanted && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black px-2 py-1 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transform rotate-12">
                WANTED
              </div>
            )}
          </div>
        </div>

        {/* User Information Card */}
        <Card className="bg-purple-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pt-12 md:pt-16">
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <h3 className="text-lg font-black text-black mb-2 uppercase">Display Name</h3>
                <p className="text-xl font-bold text-purple-700">{sessionUser.name || "Unknown User"}</p>
              </div>
              <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <h3 className="text-lg font-black text-black mb-2 uppercase">Discord Username</h3>
                <p className="text-xl font-bold text-purple-700">{userData?.discord?.name || "Not available"}</p>
              </div>
              <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-black mb-2 uppercase">Status</h3>
                    <p className={`text-xl font-bold ${userData?.wanted ? "text-red-600" : "text-green-600"}`}>
                      {userData?.wanted ? "WANTED" : "SAINT"}
                    </p>
                  </div>
                  {userData?.wanted && (
                    <Button
                      onClick={handleViewBounty}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 transform rotate-1 hover:rotate-0"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      VIEW BOUNTY
                    </Button>
                  )}
                </div>
              </div>
              <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-black mb-2 uppercase">Discord ID</h3>
                    <p className="text-xl font-bold text-purple-700 font-mono">{userData?.discord?.id || "Not available"}</p>
                  </div>
                  {userData?.discord?.id && (
                    <CopyButton
                      textToCopy={userData.discord.id}
                      label="Copy Discord ID"
                      size="md"
                      variant="cyan"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biography Section */}
      {userData?.autobiography && (
        <Card className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <CardHeader className="border-b-2 border-black bg-green-400">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-black text-black uppercase tracking-wider flex items-center justify-center gap-3 w-full">
                <FileText className="h-8 w-8" />
                Biography
              </CardTitle>
              <SpeakButton
                text={userData.autobiography}
                size="lg"
                variant="pink"
                label="Read Biography Aloud"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold text-black leading-relaxed">{userData.autobiography}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      <Card className="bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-yellow-400">
          <CardTitle className="text-3xl font-black text-black uppercase tracking-wider text-center flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h3 className="text-lg font-black text-black mb-2 uppercase">Authentication Method</h3>
              <p className="text-xl font-bold text-yellow-700">Discord OAuth</p>
            </div>
            <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h3 className="text-lg font-black text-black mb-2 uppercase">Session Status</h3>
              <p className="text-xl font-bold text-green-600">Active</p>
            </div>
          </div>
        </CardContent>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-400 rounded-full opacity-70" />
        <div className="absolute -bottom-2 -left-2 w-16 h-8 bg-cyan-400 transform rotate-12" />
      </Card>

      {/* Bounty Poster Modal */}
      {showBountyPoster && (
        <div className="animate__animated animate__fadeIn animate__faster fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="animate__animated animate__bounceIn relative max-w-2xl w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            {/* Close Button */}
            <button
              onClick={() => setShowBountyPoster(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 z-10"
            >
              ×
            </button>

            {/* Bounty Poster Content */}
            <div className="p-8 text-center">
              {loadingBountyImage
                ? (
                    <div className="space-y-4">
                      <div className="w-full h-64 bg-gray-200 border-2 border-black flex items-center justify-center">
                        <div className="w-8 h-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
                      </div>
                      <p className="text-lg font-bold text-black">Loading bounty poster...</p>
                    </div>
                  )
                : bountyImageUrl && (
                  <div className="animate__animated animate__jackInTheBox relative w-full max-w-md mx-auto border-4 border-black bg-white overflow-hidden">
                    {/* Image Loading Skeleton */}
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
                      </div>
                    )}

                    {/* Actual Image */}
                    <img
                      alt={`${sessionUser?.name}'s bounty poster`}
                      className={`w-full h-auto object-contain transition-opacity duration-300 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      src={bountyImageUrl}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
