"use client";

import type { JSX } from "react";

import { Calendar, FileText, Key, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/hooks/use-user";



/**
 * @description
 * Profile page displaying user information from the session and database.
 * Read-only view of user data with NeoBrutalism design.
 *
 * @returns {JSX.Element} The profile page component.
 */
export default function ProfilePage(): JSX.Element {
  const { data: session } = useSession();
  const { user: userData, isLoading } = useUser();
  const sessionUser = session?.user;

  if (!session || !sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl font-black text-black">No user session found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl font-black text-black">Loading user data...</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Combined Info Card */}
        <Card className="bg-pink-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
          <CardHeader className="border-b-2 border-black bg-pink-400">
            <CardTitle className="text-3xl font-black text-black uppercase tracking-wide text-center flex items-center justify-center gap-3">
              <User className="h-8 w-8" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2 border-b-2 border-black pb-2">
                  <User className="h-5 w-5" />
                  Basic Info
                </h3>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Name</p>
                  <p className="text-lg font-black text-black">{sessionUser.name || userData?.name || "Not provided"}</p>
                </div>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Discord Name</p>
                  <p className="text-lg font-black text-black">{userData?.discord?.name || sessionUser.name || "Not provided"}</p>
                </div>
              </div>

              {/* Status & Role */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2 border-b-2 border-black pb-2">
                  <Shield className="h-5 w-5" />
                  Status & Role
                </h3>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Status</p>
                  <p className={`text-lg font-black uppercase tracking-wide ${userData?.wanted ? "text-red-600" : "text-green-600"}`}>
                    {userData?.wanted ? "Wanted" : "Saint"}
                  </p>
                </div>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Discord Avatar</p>
                  <div className="flex items-center gap-3 mt-2">
                    {sessionUser.image
                      ? (
                          <img
                            src={sessionUser.image}
                            alt="Discord Avatar"
                            className="w-12 h-12 rounded-full border-2 border-black"
                          />
                        )
                      : (
                          <div className="w-12 h-12 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-black" />
                          </div>
                        )}
                    <p className="text-sm font-bold text-black">
                      {sessionUser.image ? "Available" : "No avatar"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discord Account */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2 border-b-2 border-black pb-2">
                  <Key className="h-5 w-5" />
                  Discord Account
                </h3>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Discord ID</p>
                  <p className="text-lg font-black text-black break-all">{sessionUser.discordId || userData?.discord?.id || "Not available"}</p>
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
            <CardTitle className="text-3xl font-black text-black uppercase tracking-wider text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8" />
              Biography
            </CardTitle>
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
              <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Authentication Method</p>
              <p className="text-lg font-black text-black">Discord OAuth</p>
            </div>
            <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Session Status</p>
              <p className="text-lg font-black text-green-600">Active</p>
            </div>
          </div>
        </CardContent>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-pink-400 border-2 border-black rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-4 left-4 w-8 h-3 bg-cyan-400 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
      </Card>
    </div>
  );
}
