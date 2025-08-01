import type { JSX } from "react";
import { User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



/**
 * @description
 * Skeleton loading animation for the profile page
 *
 * @returns {JSX.Element} The profile skeleton component
 */
export function ProfileSkeleton(): JSX.Element {
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

      {/* Profile Information Skeleton */}
      <div className="w-full relative">
        {/* Floating Avatar Skeleton */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-300 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* User Info Card Skeleton */}
        <Card className="bg-pink-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pt-20">
          <CardHeader className="border-b-2 border-black bg-pink-400 pt-8">
            <CardTitle className="text-3xl font-black text-black uppercase tracking-wide text-center flex items-center justify-center gap-3">
              <User className="h-8 w-8" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* Skeleton Fields */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2 animate-pulse"></div>
                  <div className="h-6 bg-gray-400 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biography Section Skeleton */}
      <Card className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
        <CardHeader className="border-b-2 border-black bg-green-400">
          <CardTitle className="text-3xl font-black text-black uppercase tracking-wider text-center">
            Biography
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" style={{ animationDelay: "0.1s" }}></div>
              <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
