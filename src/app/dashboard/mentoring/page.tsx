"use client";

import Teams from "@/features/mentoring/components/Teams";

export default function MentoringManagementPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold"> 💡 منتورینگ - راهنمایی تیم‌ها</h1>
      <Teams />
    </div>
  );
}
