import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/components/common/modal/confirm";
import { ACTION_LABELS } from "../utils/actionTranslations";

type LogEntry = {
  id: string;
  action: string;
  delta: number | null;
  timestamp: string;
  team: { name: string };
  user: { firstName: string; lastName: string };
};

export function ActionLogTable({
  logs,
  onDelete,
}: {
  logs: LogEntry[];
  onDelete: (id: string) => void;
}) {
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortedLogs = [...logs].sort((a, b) =>
    sortAsc
      ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleDeleteConfirm = async () => {
    if (!selectedLogId) return;
    setDeleting(true);
    try {
      await onDelete(selectedLogId);
    } finally {
      setDeleting(false);
      setSelectedLogId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          لیست لاگ‌ها
        </h2>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="text-sm text-blue-600 dark:text-blue-400 underline cursor-pointer"
        >
          تغییر ترتیب زمان ({sortAsc ? "قدیمی‌ترین" : "جدیدترین"})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm p-4 rtl text-right border rounded-3xl   border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 p-4 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3">تیم</th>
              <th className="p-3">کاربر</th>
              <th className="p-3">نوع عملیات</th>
              <th className="p-3">امتیاز</th>
              <th className="p-3">زمان</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedLogs.map((log) => {
              const actionLabel = ACTION_LABELS[log.action] ?? log.action;

              let deltaText = "بدون تغییر";
              let deltaClass = "text-gray-600";
              if (typeof log.delta === "number") {
                if (log.delta > 0) {
                  deltaText = `افزایش ${log.delta} امتیاز`;
                  deltaClass = "text-green-600 font-semibold";
                } else if (log.delta < 0) {
                  deltaText = `کسر ${Math.abs(log.delta)} امتیاز`;
                  deltaClass = "text-red-600 font-semibold";
                }
              }

              return (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td>{log.team?.name ?? "بدون تیم"}</td>
                  <td className="p-3">
                    {log.user.firstName} {log.user.lastName}
                  </td>
                  <td className="p-3">{actionLabel}</td>
                  <td className={`p-3 ${deltaClass}`}>{deltaText}</td>
                  <td className="p-3">
                    {new Date(log.timestamp).toLocaleString("fa-IR")}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedLogId(log.id)}
                      className="bg-red-100 cursor-pointer text-red-600 hover:bg-red-200 px-2 py-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">
                  لاگی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!selectedLogId}
        onClose={() => setSelectedLogId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="حذف لاگ"
        description={
          <>
            آیا از حذف این لاگ اطمینان دارید؟{" "}
            <span className="font-extrabold text-red-600">
              این کار قابل بازگشت نیست
            </span>
          </>
        }
        confirmText="بله، حذف کن"
        cancelText="لغو"
      />
    </div>
  );
}
