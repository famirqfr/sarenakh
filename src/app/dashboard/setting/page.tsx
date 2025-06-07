"use client";

import SettingsForm from "@/features/settings/components/SettingsForm";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت بازی</h1>
      </div>

      <SettingsForm />
    </div>
  );
}
