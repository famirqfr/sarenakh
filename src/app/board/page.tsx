"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

type Team = {
  id: string;
  name: string;
  points: number;
};

type TeamProgress = {
  teamId: string;
  progress: {
    phaseId: string;
    phaseTitle: string;
    status: "solved" | "pending" | "not-solved";
  }[];
};

const rankColors = ["from-yellow-400", "from-gray-400", "from-orange-400"];

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamProgressMap, setTeamProgressMap] = useState<
    Record<string, TeamProgress["progress"]>
  >({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axiosInstance
      .get("/api/teams/board")
      .then((res) => setTeams(res.data.teams || []))
      .catch((err) => console.error("خطا در دریافت تیم‌ها:", err));

    axiosInstance
      .get("/api/teams/progress")
      .then((res) => {
        const raw: TeamProgress[] = res.data.data || [];
        const map: Record<string, TeamProgress["progress"]> = {};
        raw.forEach((item) => {
          map[item.teamId] = item.progress;
        });
        setTeamProgressMap(map);
      })
      .catch((err) => console.error("خطا در دریافت مراحل:", err))
      .finally(() => setLoading(false));
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "🎯";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "solved")
      return <CheckCircle size={18} className="text-white" />;
    if (status === "skipped")
      return <XCircle size={18} className="text-white" />;
    return <Clock size={18} className="text-white" />;
  };

  const getBgColor = (status: string) => {
    if (status === "solved") return "bg-green-500";
    if (status === "skipped") return "bg-red-500";
    return "bg-gray-400";
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="max-w-3xl mx-auto flex flex-col gap-3 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <Link
        href="/board/phase"
        className="text-sm self-end text-orange-300 hover:text-orange-100 transition-colors underline underline-offset-4 mb-2"
      >
        مشاهده جزئیات مرحله فعال →
      </Link>
      {loading ? (
        <div className="text-center text-gray-300 text-base">
          در حال بارگذاری...
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-400">هیچ تیمی ثبت نشده است.</div>
      ) : (
        teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className={`bg-gradient-to-l ${
              rankColors[index] || "from-indigo-700"
            } to-[#1e3a8a] rounded-lg shadow-md px-4 py-3 border-r-4 border-orange-400`}
          >
            {/* Team Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-xl">{getRankIcon(index)}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold">{team.name}</span>
                  <span className="text-[11px] text-gray-200">
                    رتبه {index + 1}
                  </span>
                </div>
              </div>
              <div className="text-lg font-extrabold text-orange-300">
                {team.points.toLocaleString()}
              </div>
            </div>

            {/* Phase Progress */}
            <div
              className={`grid mt-3 gap-y-2`}
              style={{
                gridTemplateColumns: `repeat(${
                  teamProgressMap[team.id]?.length || 1
                }, minmax(0, 1fr))`,
              }}
            >
              {teamProgressMap[team.id]?.map((phase, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-[11px] text-center"
                  title={phase.phaseTitle}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full shadow-sm ${getBgColor(
                      phase.status
                    )}`}
                  >
                    {getStatusIcon(phase.status)}
                  </div>
                  <span className="mt-1 truncate">{phase.phaseTitle}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
