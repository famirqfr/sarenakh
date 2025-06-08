"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import parse from "html-react-parser";
import { Info, Timer } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type ActivePhase = {
  id: string;
  title: string;
  description: string;
  duration: number;
};

export default function PhasePage() {
  const [phase, setPhase] = useState<ActivePhase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/game-phases/active")
      .then((res) => setPhase(res.data.data))
      .catch((err) => console.error("خطا در دریافت مرحله فعال:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className=" flex flex-col gap-3 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <Link
        href="/board"
        className="text-sm self-end text-orange-300 hover:text-orange-100 transition-colors underline underline-offset-4 mb-2"
      >
        مشاهده برد
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl"
      >
        {loading ? (
          <p className="text-center text-sm text-gray-300">
            در حال بارگذاری...
          </p>
        ) : phase ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-orange-400 pb-2">
              <Info className="text-orange-300" />
              <h2 className="text-xl font-bold text-orange-300">
                {phase.title}
              </h2>
            </div>

            <div className="text-sm text-gray-100 leading-relaxed space-y-2 prose prose-invert prose-sm max-w-none">
              {parse(phase.description)}
            </div>

            <div className="flex items-center gap-2 text-sm text-orange-300 mt-2 border-t border-white/20 pt-3">
              <Timer size={18} />
              <span>مدت زمان: {phase.duration} دقیقه</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-red-400">
            مرحله فعالی وجود ندارد.
          </p>
        )}
      </motion.div>
    </div>
  );
}
