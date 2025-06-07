import { useState } from "react";
import { markAction } from "../services/cashBoxService";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/forms/button";
import ConfirmModal from "@/components/common/modal/confirm";

export function TeamActions({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "solved" | "not-solved" | null
  >(null);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      const res = await markAction(teamId, pendingAction);
      if (res.success) {
        toast.success(`امتیاز تیم بروزرسانی شد. امتیاز جدید: ${res.newPoints}`);
      } else {
        toast.error(res.error || "خطا در بروزرسانی");
      }
    } catch {
      toast.error("خطای شبکه");
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => setPendingAction("not-solved")}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-full"
        >
          <XCircle size={18} /> پاسخ غلط
        </Button>
        <Button
          onClick={() => setPendingAction("solved")}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full"
        >
          <CheckCircle size={18} /> پاسخ درست
        </Button>
      </div>

      <ConfirmModal
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        loading={loading}
        title={
          pendingAction === "solved" ? "تأیید پاسخ درست" : "تأیید پاسخ غلط"
        }
        description={
          <>
            آیا مطمئن هستید که می‌خواهید برای تیم{" "}
            <span className="text-blue-600 font-bold">{teamName}</span>{" "}
            {pendingAction === "solved"
              ? "اعلام کنید پاسخ درست داده شده است؟"
              : "اعلام کنید پاسخ غلط داده شده است؟"}
          </>
        }
        confirmText="بله"
        cancelText="لغو"
      />
    </>
  );
}
