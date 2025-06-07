"use client";

import { useState, useEffect } from "react";
import { fetchTeams, markAction } from "../services/cashBoxService";
import { Team } from "@/features/team/types/team.type";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle, XCircle, Search } from "lucide-react";
import ConfirmModal from "@/components/common/modal/confirm";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";

export default function CashBoxPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    team: Team;
    action: "solved" | "not-solved";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchTeams();
        if (res.error) {
          setError(res.error);
          setAllowed(false);
        } else {
          setTeams(res.teams);
          setAllowed(true);
        }
      } catch {
        setError("خطای شبکه");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      const res = await markAction(pendingAction.team.id, pendingAction.action);
      if (res.success) {
        toast.success(
          `امتیاز تیم ${pendingAction.team.name} بروزرسانی شد. امتیاز جدید: ${res.newPoints}`
        );
        setTeams((prev) =>
          prev.map((t) =>
            t.id === pendingAction.team.id ? { ...t, points: res.newPoints } : t
          )
        );
      } else {
        toast.error(res.error || "خطا در بروزرسانی");
      }
    } catch {
      toast.error("خطای شبکه");
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        در حال بارگذاری...
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!allowed)
    return (
      <div className="text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg shadow">
        درحال حاضر مرحله‌ای با دسترسی شما فعال نیست.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="جستجوی نام تیم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            extra="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <p className="text-center text-sm text-gray-500">هیچ تیمی پیدا نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-transform hover:-translate-y-1"
            >
              <h3 className="font-bold text-xl text-center text-gray-800 dark:text-white">
                {team.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                امتیاز فعلی: {team.points}
              </p>
              {team.leader && (
                <p className="text-center text-sm text-gray-500 mt-1">
                  سرگروه: {team.leader.firstName} {team.leader.lastName}
                </p>
              )}
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={() =>
                    setPendingAction({ team, action: "not-solved" })
                  }
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-full"
                >
                  <XCircle size={18} /> پاسخ غلط
                </Button>
                <Button
                  onClick={() => setPendingAction({ team, action: "solved" })}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full"
                >
                  <CheckCircle size={18} /> پاسخ درست
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        loading={actionLoading}
        title={
          pendingAction?.action === "solved"
            ? "تأیید پاسخ درست"
            : "تأیید پاسخ غلط"
        }
        description={
          pendingAction ? (
            <>
              آیا مطمئن هستید که می‌خواهید برای تیم{" "}
              <span className="text-blue-600 font-bold">
                {pendingAction.team.name}
              </span>{" "}
              {pendingAction.action === "solved"
                ? "اعلام کنید پاسخ درست داده شده است؟"
                : "اعلام کنید پاسخ غلط داده شده است؟"}
            </>
          ) : (
            ""
          )
        }
        confirmText="بله"
        cancelText="لغو"
      />
    </div>
  );
}
