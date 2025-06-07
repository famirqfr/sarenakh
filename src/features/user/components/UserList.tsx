"use client";

import { useEffect, useState, useMemo } from "react";
import { deleteUser, getUsers } from "../services/userApi";
import { User } from "../types/user";
import { toast } from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import Select, { Option } from "@/components/ui/forms/select";
import Input from "@/components/ui/forms/input";
import CreateUserForm from "./CreateUserForm";
import Modal from "@/components/common/modal";
import ConfirmModal from "@/components/common/modal/confirm";

const roleColors: Record<string, string> = {
  SUPERADMIN: "bg-red-100 text-red-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MENTOR: "bg-green-100 text-green-700",
  CASHIER: "bg-yellow-100 text-yellow-700",
};
interface Props {
  refreshTrigger?: boolean;
}

const UserList = ({ refreshTrigger }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Option | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsEditOpen(true); // نمایش مودال ویرایش
  };

  const refetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setDeleting(true);

    try {
      await deleteUser(deleteUserId);
      toast.success("کاربر با موفقیت حذف شد");
      refetchUsers();
      setDeleteUserId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "خطا در حذف کاربر");
    } finally {
      setDeleting(false);
    }
  };

  const roleOptions: Option[] = [
    { label: "همه نقش‌ها", value: "" },
    { label: "سوپر ادمین", value: "SUPERADMIN" },
    { label: "ادمین", value: "ADMIN" },
    { label: "منتور", value: "MENTOR" },
    { label: "صندوق‌دار", value: "CASHIER" },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.error || "خطا در دریافت کاربران");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshTrigger]);

  useEffect(() => {
    refetchUsers();
  }, [refreshTrigger]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`;
      const matchesSearch = fullName.includes(query) || u.phone.includes(query);
      const matchesRole = roleFilter?.value
        ? u.role === roleFilter.value
        : true;
      return matchesSearch && matchesRole;
    });
  }, [users, query, roleFilter]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          لیست اعضاء
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-32 sm:w-auto">
          <Input
            type="text"
            placeholder="جستجو... (نام و نام خانوادگی یا شماره تماس)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            options={roleOptions}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال بارگذاری کاربران...
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-sm text-gray-500">کاربری یافت نشد</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm rtl text-right">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3">نام کامل</th>
                  <th className="p-3">شماره تلفن</th>
                  <th className="p-3">نقش</th>
                  <th className="p-3">نوع منتور</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3 font-mono">{u.phone}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          roleColors[u.role]
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.role === "MENTOR" ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            u.mentorType === "GOOD"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.mentorType === "GOOD" ? "خوب" : "بد"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 p-1.5 rounded-md transition cursor-pointer"
                          title="ویرایش"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteUserId(u.id)}
                          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 p-1.5 rounded-md transition cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-sm"
              >
                <div className="text-sm text-gray-900 dark:text-white font-semibold">
                  {u.firstName} {u.lastName}
                </div>
                <div className="text-xs text-gray-500 font-mono">{u.phone}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      roleColors[u.role]
                    }`}
                  >
                    {u.role}
                  </span>
                  {u.role === "MENTOR" && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.mentorType === "GOOD"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.mentorType === "GOOD" ? "منتور خوب" : "منتور بد"}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(u)}
                    className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 p-1.5 rounded-md transition cursor-pointer"
                    title="ویرایش"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteUserId(u.id)}
                    className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 p-1.5 rounded-md transition cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isEditOpen && editUser && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditUser(null);
          }}
          title="ویرایش کاربر"
          size="lg"
        >
          <CreateUserForm
            mode="edit"
            defaultValues={editUser}
            onSuccess={() => {
              setIsEditOpen(false);
              setEditUser(null);
              refetchUsers();
            }}
          />
        </Modal>
      )}

      <ConfirmModal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف کاربر"
        description="آیا از حذف این کاربر مطمئن هستید؟ این عملیات قابل بازگشت نیست."
        confirmText="بله، حذف کن"
        cancelText="لغو"
        loading={deleting}
      />
    </div>
  );
};

export default UserList;
