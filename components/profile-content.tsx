"use client";

import type { JSX } from "react";

import { Calendar, Eye, FileText, Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Tilt from "react-parallax-tilt";

import { CopyButton } from "@/components/copy-button";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageReady } from "@/lib/hooks/use-page-ready";
import { useUser } from "@/lib/hooks/use-user";



/**
 * @description
 * Client component for the profile page content using reusable buttons
 *
 * @returns The profile content component
 */
export function ProfileContent(): JSX.Element {
  usePageReady();

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
    setImageLoading(true);

    try {
      const response = await fetch(`/api/bounty-image?userId=${userData.id}`);
      const data = await response.json();

      if (data.success && data.imageUrl) {
        setBountyImageUrl(data.imageUrl);
        setShowBountyPoster(true);
      }
      else {
        throw new Error("No bounty poster found");
      }
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
                      disabled={loadingBountyImage}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 transform rotate-1 hover:rotate-0 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {loadingBountyImage
                        ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              LOADING...
                            </>
                          )
                        : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              VIEW BOUNTY
                            </>
                          )}
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
                size="md"
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
        <div className="animate__animated animate__fadeIn animate__fast fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          {/* NeoBrutalism themed backdrop with blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-cyan-400 to-yellow-400 opacity-50" />

          {/* NeoBrutalism pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full bg-black"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(0,0,0,0.3) 20px,
                  rgba(0,0,0,0.3) 40px
                )`,
              }}
            />
          </div>

          {/* Close Button - Fixed at top right of screen */}
          <button
            onClick={() => setShowBountyPoster(false)}
            className="animate__animated animate__bounceIn animate__delay-1s fixed top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center"
          >
            ×
          </button>

          <div className="animate__animated animate__jackInTheBox relative z-10">
            {/* Bounty Poster Content */}
            {bountyImageUrl && (
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.05}
                transitionSpeed={1500}
                gyroscope={true}
                glareEnable={true}
                glareMaxOpacity={0.45}
              >
                {/* Main poster container */}
                <div className="animate__animated animate__jackInTheBox relative border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
              </Tilt>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
