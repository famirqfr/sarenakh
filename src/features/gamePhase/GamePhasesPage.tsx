"use client";

import { useEffect, useState } from "react";
import {
  getGamePhases,
  createGamePhase,
  updateGamePhase,
  deleteGamePhase,
  activateGamePhase,
  deactivateGamePhase, // ✅ اضافه شده
} from "./api/gamePhaseApi";
import { GamePhase } from "./types/gamePhase.types";
import GamePhaseTable from "./components/GamePhaseTable";
import GamePhaseForm from "./components/GamePhaseForm";
import Modal from "@/components/common/modal";
import ConfirmModal from "@/components/common/modal/confirm";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/forms/button";
import { GamePhaseFormValues } from "./schema/gamePhase.schema";

const GamePhasesPage = () => {
  const [phases, setPhases] = useState<GamePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<GamePhase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletePhaseId, setDeletePhaseId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatePhase, setActivatePhase] = useState<GamePhase | null>(null);
  const [deactivatePhase, setDeactivatePhase] = useState<GamePhase | null>(
    null
  );
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const fetchPhases = async () => {
    setLoading(true);
    try {
      const data = await getGamePhases();
      setPhases(data);
    } catch {
      toast.error("خطا در دریافت مراحل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const handleCreateOrUpdate = async (
    phase: GamePhaseFormValues & { id?: string }
  ) => {
    try {
      if (phase.id) {
        await updateGamePhase(phase);
        toast.success("مرحله با موفقیت بروزرسانی شد");
      } else {
        await createGamePhase(phase);
        toast.success("مرحله جدید با موفقیت ایجاد شد");
      }
      fetchPhases();
      setIsFormOpen(false);
      setSelectedPhase(null);
    } catch {
      toast.error("خطا در ذخیره مرحله");
    }
  };

  const handleDelete = async () => {
    if (!deletePhaseId) return;
    setDeleting(true);
    try {
      await deleteGamePhase(deletePhaseId);
      toast.success("مرحله با موفقیت حذف شد");
      fetchPhases();
      setDeletePhaseId(null);
    } catch {
      toast.error("خطا در حذف مرحله");
    } finally {
      setDeleting(false);
    }
  };

  const handleActivatePhase = async () => {
    if (!activatePhase) return;
    setActivating(true);
    try {
      await activateGamePhase(activatePhase.id!);
      toast.success("مرحله با موفقیت فعال شد");
      fetchPhases();
      setActivatePhase(null);
    } catch {
      toast.error("خطا در فعال‌سازی مرحله");
    } finally {
      setActivating(false);
    }
  };

  const handlePausePhase = async () => {
    if (!deactivatePhase) return;
    setDeactivating(true);
    try {
      await deactivateGamePhase(deactivatePhase.id!);
      toast.success("مرحله با موفقیت غیرفعال شد");
      fetchPhases();
      setDeactivatePhase(null);
    } catch {
      toast.error("خطا در غیرفعال‌سازی مرحله");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          لیست مراحل بازی
        </h2>
        <Button
          onClick={() => {
            setSelectedPhase(null);
            setIsFormOpen(true);
          }}
          className="bg-[#ff5f00] hover:bg-[#e35500] text-white px-4 py-2 rounded-md"
        >
          ایجاد مرحله جدید
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال بارگذاری مراحل...
        </div>
      ) : (
        <GamePhaseTable
          phases={phases}
          onEdit={(phase) => {
            setSelectedPhase(phase);
            setIsFormOpen(true);
          }}
          onDelete={(id) => setDeletePhaseId(id)}
          onActivate={(phase) => setActivatePhase(phase)}
          onPause={(phase) => setDeactivatePhase(phase)}
        />
      )}

      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPhase(null);
          }}
          title={selectedPhase ? "ویرایش مرحله" : "ایجاد مرحله جدید"}
          size="lg"
        >
          <GamePhaseForm
            phase={selectedPhase ?? undefined}
            onSubmit={handleCreateOrUpdate}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedPhase(null);
            }}
          />
        </Modal>
      )}

      <ConfirmModal
        isOpen={!!deletePhaseId}
        onClose={() => setDeletePhaseId(null)}
        onConfirm={handleDelete}
        title="حذف مرحله"
        description="آیا از حذف این مرحله مطمئن هستید؟ این عملیات قابل بازگشت نیست."
        confirmText="بله، حذف کن"
        cancelText="لغو"
        loading={deleting}
      />

      <Modal
        isOpen={!!activatePhase}
        onClose={() => setActivatePhase(null)}
        title="فعال‌سازی مرحله"
      >
        <div className="space-y-4">
          <p>
            آیا می‌خواهید مرحله <strong>{activatePhase?.title}</strong> را فعال
            کنید؟
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setActivatePhase(null)}>لغو</Button>
            <Button
              onClick={handleActivatePhase}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {activating ? "در حال فعال‌سازی..." : "فعال کن"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deactivatePhase}
        onClose={() => setDeactivatePhase(null)}
        title="غیر فعال‌سازی مرحله"
      >
        <div className="space-y-4">
          <p>
            آیا می‌خواهید مرحله <strong>{activatePhase?.title}</strong> را
            غیرفعال کنید؟
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setActivatePhase(null)}>لغو</Button>
            <Button
              onClick={handlePausePhase}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {deactivating ? "در حال غیرفعال‌سازی..." : "غیرفعال کن"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GamePhasesPage;
