"use client";

import { ReactNode } from "react";
import Modal from ".";
import Button from "@/components/ui/forms/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأیید عملیات",
  description = "آیا از انجام این عملیات مطمئن هستید؟",
  confirmText = "بله، حذف کن",
  cancelText = "لغو",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>

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
            disable={loading}
          >
            {loading ? "در حال حذف..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
