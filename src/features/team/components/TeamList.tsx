"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/common/modal/confirm";
import { useAuth } from "@/context/AuthContext";
import { deleteTeam, getTeams, updateTeam } from "../services/team.api";
import { Team } from "../types/team.type";
import Button from "@/components/ui/forms/button";
import Modal from "@/components/common/modal";
import TeamForm from "./TeamForm";
import { FormData } from "../schemas/team.schema";

const TeamList = ({ refreshKey }: { refreshKey: number }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const isAllowed = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  useEffect(() => {
    if (isAllowed) fetchTeams();
  }, [isAllowed, refreshKey]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data);
    } catch {
      toast.error("خطا در دریافت تیم‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) fetchTeams();
  }, [isAllowed]);

  const handleDeleteConfirm = async () => {
    if (!selectedTeamId) return;
    setDeleting(true);
    try {
      await deleteTeam(selectedTeamId);
      toast.success("تیم حذف شد");
      await fetchTeams();
    } catch {
      toast.error("خطا در حذف تیم");
    } finally {
      setDeleting(false);
      setSelectedTeamId(null);
    }
  };

  const handleUpdateTeam = async (data: FormData) => {
    if (!editingTeam) return;
    try {
      await updateTeam(editingTeam.id, data);
      toast.success("تیم با موفقیت ویرایش شد");
      await fetchTeams();
      setEditingTeam(null);
    } catch {
      toast.error("خطا در ویرایش تیم");
    }
  };

  if (!isAllowed) {
    return (
      <div className="text-red-500 text-sm border border-red-300 bg-red-50 p-4 rounded-lg">
        شما دسترسی لازم برای مشاهده این بخش را ندارید.
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        لیست تیم‌ها
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال بارگذاری...
        </div>
      ) : teams.length === 0 ? (
        <p className="text-sm text-gray-500">تیمی یافت نشد</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm rtl text-right border border-gray-200 dark:border-gray-700 rounded">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="p-3">نام تیم</th>
                <th className="p-3">سرگروه</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3">امتیاز</th>
                <th className="p-3">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {teams.map((team) => (
                <tr
                  key={team.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3 font-bold">{team.name}</td>
                  <td className="p-3">
                    {team.leader.firstName} {team.leader.lastName}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        team.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {team.status === "ACTIVE" ? "فعال" : "خارج شده"}
                    </span>
                  </td>
                  <td className="p-3">{team.points.toLocaleString()}</td>
                  <td className="p-3 flex gap-2">
                    <Button
                      onClick={() => setEditingTeam(team)}
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      onClick={() => setSelectedTeamId(team.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مدال تایید حذف */}
      <ConfirmModal
        isOpen={!!selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف تیم"
        description="آیا از حذف این تیم مطمئن هستید؟"
        confirmText="بله، حذف"
        cancelText="لغو"
        loading={deleting}
      />

      {/* مدال ویرایش */}
      <Modal
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        title={`ویرایش تیم: ${editingTeam?.name}`}
        size="lg"
      >
        {editingTeam && (
          <TeamForm
            isEditMode={true}
            defaultValues={{
              leader: {
                id: editingTeam.leader.id,
                firstName: editingTeam.leader.firstName ?? "",
                lastName: editingTeam.leader.lastName ?? "",
                phone: editingTeam.leader.phone ?? "",
                age: editingTeam.leader.age ?? 18,
              },
              members: editingTeam.members
                .filter((m) => m.phone !== editingTeam.leader.phone)
                .map((m) => ({
                  id: m.id,
                  firstName: m.firstName ?? "",
                  lastName: m.lastName ?? "",
                  phone: m.phone ?? "",
                  age: m.age ?? 18,
                  relation: m.relation ?? "",
                })),
              name: editingTeam.name ?? "",
              points: editingTeam.points ?? 0,
            }}
            onSubmitHandler={handleUpdateTeam}
            submitLabel="ذخیره تغییرات"
          />
        )}
      </Modal>
    </div>
  );
};

export default TeamList;
