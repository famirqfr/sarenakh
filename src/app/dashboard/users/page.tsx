"use client";

import Modal from "@/components/common/modal";
import Button from "@/components/ui/forms/button";
import CreateUserForm from "@/features/user/components/CreateUserForm";
import UserList from "@/features/user/components/UserList";
import { useState } from "react";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);

  const handleUserCreated = () => {
    setIsOpen(false);
    setRefreshKey((prev) => !prev);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت اعضا</h1>
        <Button onClick={() => setIsOpen(true)}>+ افزودن کاربر</Button>
      </div>

      <UserList refreshTrigger={refreshKey} />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="افزودن کاربر جدید"
        size="lg"
      >
        <CreateUserForm mode="create" onSuccess={handleUserCreated} />
      </Modal>
    </div>
  );
}
