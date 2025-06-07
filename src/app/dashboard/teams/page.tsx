"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import TeamList from "@/features/team/components/TeamList";
import Modal from "@/components/common/modal";
import Button from "@/components/ui/forms/button";
import TeamForm from "@/features/team/components/TeamForm";
import { createTeam } from "@/features/team/services/team.api";

export default function TeamManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN";
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isAdmin) {
    return <div className="text-red-500">دسترسی غیرمجاز</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت تیم‌ها</h1>
        <Button onClick={() => setIsOpen(true)}>+ افزودن تیم</Button>
      </div>

      <TeamList refreshKey={refreshKey} />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="افزودن تیم جدید"
        size="lg"
      >
        <TeamForm
          onSubmitHandler={async (data) => {
            await createTeam(data);
            setIsOpen(false);
            setRefreshKey((prev) => prev + 1);
          }}
          submitLabel="ساخت تیم"
        />
      </Modal>
    </div>
  );
}
