"use client";

import { useState, useEffect } from "react";
import { ReactNode } from "react";
import Modal from ".";
import Button from "@/components/ui/forms/button";
import Input from "@/components/ui/forms/input";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;

  // 🟡 جدید: تنظیمات رمز
  requirePassword?: boolean;
  correctPassword?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأیید عملیات",
  description = "آیا از انجام این عملیات مطمئن هستید؟",
  confirmText = "بله، انجام بده",
  cancelText = "لغو",
  loading = false,
  requirePassword = false,
  correctPassword = "",
}: ConfirmModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) setPassword(""); 
  }, [isOpen]);

  const isPasswordValid =
    !requirePassword || password.trim() === correctPassword;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>

        {requirePassword && (
          <Input
            label="رمز تأیید"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="مثلاً: 123456"
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
            disable={loading || !isPasswordValid}
          >
            {loading ? "در حال اجرا..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
