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
        <div className="absolute -top-8 md:-top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-black bg-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="w-full h-full bg-purple-300 flex items-center justify-center">
                <User className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            {/* Status Badge Skeleton */}
            <div className="absolute -top-2 -right-2 bg-gray-300 text-transparent text-xs font-black px-2 py-1 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transform rotate-12 animate-pulse">
              LOADING
            </div>
          </div>
        </div>

        {/* User Information Card Skeleton */}
        <Card className="bg-purple-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pt-12 md:pt-16">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {/* Display Name Field */}
              <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:transform sm:-rotate-1">
                <h3 className="text-base sm:text-lg font-black text-black mb-2 uppercase">Display Name</h3>
                <div className="h-5 sm:h-6 bg-purple-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Discord Username Field */}
              <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:transform sm:rotate-1">
                <h3 className="text-base sm:text-lg font-black text-black mb-2 uppercase">Discord Username</h3>
                <div className="h-5 sm:h-6 bg-purple-200 rounded w-2/3 animate-pulse"></div>
              </div>

              {/* Status Field with Button */}
              <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:transform sm:rotate-1">
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-black text-black mb-2 uppercase">Status</h3>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="w-full sm:w-24 h-8 bg-red-200 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
                </div>
              </div>

              {/* Discord ID Field with Copy Button */}
              <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:transform sm:-rotate-1">
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-black text-black mb-2 uppercase">Discord ID</h3>
                    <div className="h-4 sm:h-5 md:h-6 bg-purple-200 rounded w-32 animate-pulse font-mono"></div>
                  </div>
                  <div className="w-10 h-10 bg-cyan-200 border-2 border-black rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
                </div>
              </div>

              {/* Permissions Field */}
              <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:transform col-span-2">
                <h3 className="text-lg font-black text-black mb-3 uppercase">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-28 bg-gray-200 border-2 border-black animate-pulse"></div>
                  <div className="h-7 w-20 bg-gray-200 border-2 border-black animate-pulse"></div>
                  <div className="h-7 w-24 bg-gray-200 border-2 border-black animate-pulse"></div>
                  <div className="h-7 w-24 bg-gray-200 border-2 border-black animate-pulse"></div>
                  <div className="h-7 w-20 bg-gray-200 border-2 border-black animate-pulse"></div>
                </div>
              </div>
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
