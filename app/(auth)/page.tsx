"use client";

import type { JSX } from "react";

import { Award, Calendar, Clock, Gamepad2, Heart, TrendingUp, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useEvents } from "@/lib/hooks/use-events";
import { useGameEndorsements } from "@/lib/hooks/use-game-endorsements";
import { useMatches } from "@/lib/hooks/use-matches";
import { usePageReady } from "@/lib/hooks/use-page-ready";
import { useReputation } from "@/lib/hooks/use-reputation";
import { useUser } from "@/lib/hooks/use-user";



interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  href: string;
}

function DashboardCard({ title, value, icon, color, subtitle, href }: DashboardCardProps): JSX.Element {
  return (
    <Link href={href}>
      <div className={`${color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-black opacity-80">
              {icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-black">
                {value}
              </div>
              <div className="text-sm font-bold text-black opacity-70">
                {title}
              </div>
            </div>
          </div>
          {subtitle && (
            <div className="text-xs font-bold text-black opacity-60">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

interface WsLsChartProps {
  ws: number;
  ls: number;
}

function WsLsChart({ ws, ls }: WsLsChartProps): JSX.Element {
  const chartData = [
    {
      name: "Ws",
      value: ws,
      fill: "#22c55e",
    },
    {
      name: "Ls",
      value: ls,
      fill: "#ef4444",
    },
  ];

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-black text-black uppercase tracking-wider">
          Ws vs Ls
        </h2>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, fontWeight: 700 }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: 700 }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
            />
            <Tooltip
              labelStyle={{ fontWeight: 700, color: "#000" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #000",
                fontWeight: 700,
              }}
            />
            <Bar
              dataKey="value"
              stroke="#000"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-green-100 border-2 border-black p-3 text-center">
          <div className="text-2xl font-black text-green-700">{ws}</div>
          <div className="text-sm font-bold text-green-700">Ws</div>
        </div>
        <div className="bg-red-100 border-2 border-black p-3 text-center">
          <div className="text-2xl font-black text-red-700">{ls}</div>
          <div className="text-sm font-bold text-red-700">Ls</div>
        </div>
      </div>
    </div>
  );
}

/**
 * @description
 * Main dashboard page with refined NeoBrutalism design.
 *
 * @returns {JSX.Element} The dashboard page component.
 */
export default function DashboardPage(): JSX.Element {
  usePageReady();

  const { user, isLoading: isUserLoading } = useUser();
  const { data: events } = useEvents();
  const { data: matches } = useMatches();
  const { data: reputation } = useReputation();
  const { data: userEndorsements } = useGameEndorsements({
    type: "global",
  });

  // Calculate dashboard metrics
  const dashboardStats = useMemo(() => {
    const currentTime = Date.now();
    const oneWeekFromNow = currentTime + (7 * 24 * 60 * 60 * 1000);

    // Get upcoming fenj matches
    const upcomingFenjMatches = matches?.filter(match =>
      match.field_name?.toLowerCase().includes("fenj")
      && match.timestamp * 1000 > currentTime
      && match.timestamp * 1000 < oneWeekFromNow,
    ).length || 0;

    // Get user's endorsements count
    const userEndorsementsCount = userEndorsements?.find(endorsement =>
      "discord_id" in endorsement && endorsement.discord_id === user?.discord?.id,
    )?.endorsements || 0;

    // Events count (could be filtered for user-specific events if needed)
    const eventsCount = events?.length || 0;

    // For memes count, we'll use a placeholder since there's no specific memes API
    // This could be derived from matches or events in a real implementation
    const memesCount = Math.floor(Math.random() * 50) + 10; // Placeholder

    return {
      upcomingFenjMatches,
      userEndorsementsCount,
      eventsCount,
      memesCount,
      ws: reputation?.summary.received_ws || 0,
      ls: reputation?.summary.received_ls || 0,
    };
  }, [matches, userEndorsements, user?.discord?.id, events, reputation]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-2xl font-black text-black">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-blue-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Dashboard
        </h1>
        <p className="text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          Welcome back,
          {" "}
          {user?.name || "Gamer"}
          !
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Upcoming Fenj Matches"
          value={dashboardStats.upcomingFenjMatches}
          icon={<Clock className="w-8 h-8" />}
          color="bg-yellow-300"
          subtitle="Next 7 days"
          href="/fenj"
        />

        <DashboardCard
          title="Memes Created"
          value={dashboardStats.memesCount}
          icon={<Heart className="w-8 h-8" />}
          color="bg-pink-300"
          subtitle="All time"
          href="/memes"
        />

        <DashboardCard
          title="Events"
          value={dashboardStats.eventsCount}
          icon={<Calendar className="w-8 h-8" />}
          color="bg-green-300"
          subtitle="Total events"
          href="/timeline"
        />

        <DashboardCard
          title="Game Endorsements"
          value={dashboardStats.userEndorsementsCount}
          icon={<Award className="w-8 h-8" />}
          color="bg-purple-300"
          subtitle="Your endorsements"
          href="/gaming"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ws vs Ls Chart */}
        <WsLsChart
          ws={dashboardStats.ws}
          ls={dashboardStats.ls}
        />

        {/* Quick Stats Card */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-black text-black uppercase tracking-wider">
              Quick Stats
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-black">Win Rate</span>
              </div>
              <span className="text-lg font-black text-black">
                {dashboardStats.ws + dashboardStats.ls > 0
                  ? Math.round((dashboardStats.ws / (dashboardStats.ws + dashboardStats.ls)) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-black">Total Matches</span>
              </div>
              <span className="text-lg font-black text-black">
                {dashboardStats.ws + dashboardStats.ls}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-bold text-black">Active Since</span>
              </div>
              <span className="text-lg font-black text-black">
                Today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-black text-black uppercase tracking-wider">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-3">
          {matches?.slice(0, 5).map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-black text-sm">
                  {match.field_name || `Field ${match.field_id}`}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-600">
                {new Date(match.timestamp * 1000).toLocaleDateString()}
              </span>
            </div>
          )) || (
            <div className="text-center py-8">
              <p className="text-lg font-bold text-gray-600">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
