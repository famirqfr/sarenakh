"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axiosInstance";
import { LogFilter } from "./components/LogFilter";
import { ActionLogTable } from "./components/ActionLogTable";
import { ACTION_LABELS } from "./utils/actionTranslations";
import { ClipboardList } from "lucide-react";

type LogEntry = {
  id: string;
  action: string;
  delta: number | null;
  timestamp: string;
  team: { id: string; name: string };
  user: { id: string; firstName: string; lastName: string };
};

type ActionOption = { value: string; label: string };

export default function LogsPage() {
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    axios.get("/api/logs").then((res) => {
      setAllLogs(res.data);
      setFilteredLogs(res.data);
    });
  }, []);
  
  const handleDelete = async (id: string) => {
    await axios.delete("/api/logs", { params: { logId: id } });
    const newLogs = allLogs.filter((log) => log.id !== id);
    setAllLogs(newLogs);
    setFilteredLogs(newLogs);
  };

  const handleFilter = (filters: {
    teamId?: string;
    userId?: string;
    action?: string;
  }) => {
    let result = [...allLogs];

    if (filters.teamId) {
      result = result.filter((log) => log.team.id === filters.teamId);
    }
    if (filters.userId) {
      result = result.filter((log) => log.user.id === filters.userId);
    }
    if (filters.action) {
      result = result.filter((log) => log.action === filters.action);
    }

    setFilteredLogs(result);
  };

  const teams = Array.from(
    new Map(
      allLogs
        .filter((log) => log.team && log.team.id)
        .map((log) => [log.team.id, log.team])
    ).values()
  );

  const users = Array.from(
    new Map(
      allLogs
        .filter((log) => log.user && log.user.id)
        .map((log) => [log.user.id, log.user])
    ).values()
  );

  const actions: ActionOption[] = Array.from(
    new Set(allLogs.map((log) => log.action))
  ).map((action) => ({
    value: action,
    label: ACTION_LABELS[action] ?? action,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-8 rounded-xl shadow space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-800 dark:text-white">
        <ClipboardList className="w-6 h-6 text-orange-500" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          مدیریت لاگ‌ها
        </h1>
      </div>

      <div className="w-full overflow-x-auto">
        <LogFilter
          onChange={handleFilter}
          teams={teams}
          users={users}
          actions={actions}
        />
        <ActionLogTable logs={filteredLogs} onDelete={handleDelete} />
      </div>
    </div>
  );
}
