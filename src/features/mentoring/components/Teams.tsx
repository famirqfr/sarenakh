"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, PlusCircle, MinusCircle, Search, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Team } from "@/features/team/types/team.type";
import { getTeams } from "@/features/team/services/team.api";
import {
  fetchHelpCosts,
  action,
  customAddPoints,
  customDeductPoints,
} from "../api/mentoringApi";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import ConfirmModal from "@/components/common/modal/confirm";
import axios from "axios";

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState({
    simple: 0,
    professional: 0,
    special: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [customPointsMap, setCustomPointsMap] = useState<
    Record<string, string>
  >({});
  const [pendingPointAction, setPendingPointAction] = useState<{
    team: Team;
    type:
      | "custom-add"
      | "custom-deduct"
      | "simple"
      | "professional"
      | "special";
    amount: number;
  } | null>(null);

  const isAllowed = ["SUPERADMIN", "ADMIN", "MENTOR"].includes(
    user?.role ?? ""
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamData, costData] = await Promise.all([
        getTeams(),
        fetchHelpCosts(),
      ]);
      setTeams(teamData);
      setCosts(costData);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) fetchData();
  }, [isAllowed]);

  const confirmPointAction = async () => {
    if (!pendingPointAction || !user) return;

    const { team, type, amount } = pendingPointAction;

    try {
      if (type === "custom-add") {
        await customAddPoints(team.id, amount);
        toast.success("امتیاز با موفقیت افزوده شد");
      } else if (type === "custom-deduct") {
        await customDeductPoints(team.id, amount);
        toast.success("امتیاز با موفقیت کسر شد");
      } else {
        await action(team.id, amount, type);
        toast.success("امتیاز بابت راهنمایی ثبت شد");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data?.error;
        if (serverError) {
          toast.error(serverError);
        } else {
          toast.error("خطا در ارتباط با سرور");
        }
      } else {
        toast.error("خطای نامشخصی رخ داده است");
      }
    } finally {
      setPendingPointAction(null);
      setCustomPointsMap((prev) => {
        const newMap = { ...prev };
        if (team.id) delete newMap[team.id];
        return newMap;
      });
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAllowed) {
    return (
      <div className="text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg shadow">
        شما دسترسی لازم برای مشاهده این بخش را ندارید.
      </div>
    );
  }

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

      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          در حال بارگذاری...
        </div>
      ) : filteredTeams.length === 0 ? (
        <p className="text-center text-sm text-gray-500">هیچ تیمی پیدا نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const isAdmin =
              user?.role === "SUPERADMIN" || user?.role === "ADMIN";
            return (
              <div
                key={team.id}
                className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-transform hover:-translate-y-1"
              >
                <h3 className="font-bold text-xl text-center text-gray-800 dark:text-white">
                  {team.name}
                </h3>
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    onClick={() =>
                      setPendingPointAction({
                        team,
                        type: "simple",
                        amount: costs.simple,
                      })
                    }
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Star size={16} />
                    راهنمایی ساده
                    <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                      -{costs.simple}
                    </span>
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingPointAction({
                        team,
                        type: "professional",
                        amount: costs.professional,
                      })
                    }
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Star size={16} />
                    راهنمایی حرفه‌ای
                    <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs">
                      -{costs.professional}
                    </span>
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingPointAction({
                        team,
                        type: "special",
                        amount: costs.special,
                      })
                    }
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Star size={16} />
                    راهنمایی ویژه
                    <span className="bg-white text-purple-600 rounded-full px-2 py-0.5 text-xs">
                      -{costs.special}
                    </span>
                  </Button>
                  {isAdmin && (
                    <div
                      className={`flex gap-2 items-center ${
                        !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Input
                        placeholder="مقدار دلخواه"
                        type="number"
                        min={1}
                        value={customPointsMap[team.id] || ""}
                        onChange={(e) =>
                          setCustomPointsMap((prev) => ({
                            ...prev,
                            [team.id]: e.target.value,
                          }))
                        }
                        className="w-full"
                        disabled={!isAdmin}
                      />

                      <Button
                        onClick={() => {
                          const amt = Number(customPointsMap[team.id]);
                          if (!amt || amt <= 0) {
                            toast.error("مقدار معتبر وارد کنید");
                            return;
                          }
                          setPendingPointAction({
                            team,
                            type: "custom-deduct",
                            amount: amt,
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <MinusCircle size={18} />
                      </Button>

                      <Button
                        onClick={() => {
                          const amt = Number(customPointsMap[team.id]);
                          if (!amt || amt <= 0) {
                            toast.error("مقدار معتبر وارد کنید");
                            return;
                          }
                          setPendingPointAction({
                            team,
                            type: "custom-add",
                            amount: amt,
                          });
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        <PlusCircle size={18} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingPointAction}
        onClose={() => setPendingPointAction(null)}
        onConfirm={confirmPointAction}
        title={
          pendingPointAction?.type === "custom-add"
            ? "تأیید افزودن امتیاز"
            : pendingPointAction?.type === "custom-deduct"
            ? "تأیید کسر امتیاز"
            : "تأیید ثبت راهنمایی"
        }
        description={
          pendingPointAction ? (
            <>
              آیا مطمئن هستید که می‌خواهید{" "}
              <span
                className={
                  pendingPointAction.type === "custom-add"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {pendingPointAction.amount}
              </span>{" "}
              امتیاز {pendingPointAction.type === "custom-add" ? "به" : "از"}{" "}
              تیم{" "}
              <span className="text-blue-600 font-bold">
                {pendingPointAction.team.name}
              </span>{" "}
              {pendingPointAction.type === "custom-add"
                ? "افزوده شود؟"
                : "کسر شود؟"}
            </>
          ) : (
            ""
          )
        }
        confirmText="تأیید"
        cancelText="لغو"
      />
    </div>
  );
};

export default Teams;
