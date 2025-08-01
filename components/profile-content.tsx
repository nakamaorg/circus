"use client";

import type { JSX } from "react";

import { Calendar, FileText, User } from "lucide-react";
import { useSession } from "next-auth/react";

import { CopyButton } from "@/components/copy-button";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { SpeakButton } from "@/components/speak-button";
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
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-cyan-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          User Profile
        </h1>
        <p className="text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          Your account information
        </p>
      </div>

      {/* Profile Information */}
      <div className="w-full relative">
        {/* Floating Avatar */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
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
        <Card className="bg-purple-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pt-16">
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
                <h3 className="text-lg font-black text-black mb-2 uppercase">Status</h3>
                <p className={`text-xl font-bold text-purple-700 ${userData?.wanted ? "text-red-600" : "text-green-600"}`}>
                  {userData?.wanted ? "WANTED" : "SAINT"}
                </p>
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
              <CardTitle className="text-3xl font-black text-black uppercase tracking-wider flex items-center gap-3">
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
    </div>
  );
}
