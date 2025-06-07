"use client";

import LogsPage from "@/features/logs/LogsPage";

export default function MentoringManagementPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">
        📊 مدیریت فعالیت تیم‌ها و لاگ‌های سیستمی
      </h1>
      <LogsPage />
    </div>
  );
}
