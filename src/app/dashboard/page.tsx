"use client";

import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import {
  Users,
  Shield,
  Timer,
  Trophy,
  ChevronRight,
  Award,
} from "lucide-react";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

type Team = {
  id: string;
  name: string;
  status: string;
  points: number;
  mentorHelp: number;
  cashboxVisit: number;
};

type Mentor = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type Metrics = {
  teamCount: number;
  mentorCount: number;
  latestTeams: Team[];
  latestMentors: Mentor[];
};

type Phase = {
  title: string;
  duration: number;
  remaining: number;
  active: boolean;
};

type LeaderboardTeam = Team;

export default function DashboardPage() {
  const { user } = useAuth();

  const shouldFetchMetrics =
    user && (user.role === "ADMIN" || user.role === "SUPERADMIN");

  const { data: metrics } = useSWR<Metrics>(
    shouldFetchMetrics ? "/api/dashboard/admin-metrics" : null,
    fetcher
  );

  const { data: leaderboard } = useSWR<LeaderboardTeam[]>(
    "/api/dashboard/leaderboard",
    fetcher
  );

  const { data: phase } = useSWR<Phase>(
    "/api/dashboard/current-phase",
    fetcher
  );

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          داشبورد{" "}
          <span className="text-indigo-600">
            {user?.role === "SUPERADMIN"
              ? "سوپرادمین"
              : user?.role === "ADMIN"
              ? "ادمین"
              : "کاربر"}
          </span>
        </h1>
        <p className="text-gray-500 mt-1">به پنل مدیریت خوش آمدید.</p>
      </div>

      {/* Metrics */}
      {metrics && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500">تعداد تیم‌ها</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {metrics.teamCount}
                </h3>
              </div>
              <Users className="text-indigo-600" size={36} />
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500">تعداد منتورها</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {metrics.mentorCount}
                </h3>
              </div>
              <Shield className="text-green-600" size={36} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-700 mb-3">تیم‌های اخیر</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {metrics.latestTeams.map((team) => (
                  <li
                    key={team.id}
                    className="flex items-center justify-between"
                  >
                    <span>{team.name}</span>
                    <span className="text-xs text-gray-400">{team.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-700 mb-3">منتورهای جدید</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {metrics.latestMentors.map((mentor) => (
                  <li key={mentor.id}>
                    {mentor.firstName} {mentor.lastName} –{" "}
                    <span className="text-gray-500">{mentor.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href="/admin/teams"
              className="text-indigo-600 hover:underline flex items-center"
            >
              مدیریت تیم‌ها <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/admin/mentors"
              className="text-green-600 hover:underline flex items-center"
            >
              مدیریت منتورها <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>
      )}

      {/* Leaderboard */}
      {leaderboard && (
        <section className="bg-white shadow rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">
              رتبه‌بندی تیم‌ها
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="px-4 py-2 rounded-r-lg">ردیف</th>
                  <th className="px-4 py-2">نام تیم</th>
                  <th className="px-4 py-2">امتیاز</th>
                  <th className="px-4 py-2">مراجعه به منتور</th>
                  <th className="px-4 py-2 rounded-l-lg">مراجعه به صندوق</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 10).map((team, index: number) => {
                  let badge = null;
                  if (index === 0)
                    badge = <Award className="text-yellow-500" size={18} />;
                  else if (index === 1)
                    badge = <Award className="text-gray-400" size={18} />;
                  else if (index === 2)
                    badge = <Award className="text-orange-700" size={18} />;

                  return (
                    <tr
                      key={team.id}
                      className="bg-gray-50 text-gray-800 shadow rounded-lg"
                    >
                      <td className="px-4 py-2 font-bold flex items-center gap-2">
                        {index + 1} {badge}
                      </td>
                      <td className="px-4 py-2">{team.name}</td>
                      <td className="px-4 py-2">{team.points}</td>
                      <td className="px-4 py-2">{team.mentorHelp}</td>
                      <td className="px-4 py-2">{team.cashboxVisit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Active phase */}
      {phase && phase.active && (
        <section className="bg-white shadow rounded-2xl p-6 flex items-start gap-4">
          <Timer className="text-purple-600 mt-1" size={28} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              مرحله فعال: {phase.title}
            </h2>
            <p className="text-gray-600 text-sm">
              مدت مرحله: {phase.duration} دقیقه – زمان باقی‌مانده:{" "}
              <span className="font-bold text-indigo-600">
                {phase.remaining}
              </span>{" "}
              دقیقه
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
