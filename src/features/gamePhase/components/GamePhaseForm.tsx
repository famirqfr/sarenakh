import React, { useEffect } from "react";
import { GamePhase } from "../types/gamePhase.types";
import { useForm, useController } from "react-hook-form";
import { gamePhaseForm, GamePhaseFormValues } from "../schema/gamePhase.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import PrettyMultiSelect from "@/components/ui/forms/select/MultiSelect";

type Props = {
  phase?: GamePhase & { allowedRoles?: string[] };
  onSubmit: (phase: GamePhaseFormValues & { id?: string }) => Promise<void>;
  onClose?: () => void;
};

const GamePhaseForm: React.FC<Props> = ({ phase, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<GamePhaseFormValues & { id?: string }>({
    resolver: zodResolver(gamePhaseForm),
    defaultValues: {
      id: undefined,
      title: "",
      description: "",
      rewardPoints: 0,
      duration: 60,
      isActive: false,
      allowedRoles: ["SUPERADMIN", "ADMIN", "CASHIER"],
    },
  });

  const { field } = useController({ name: "allowedRoles", control });

  useEffect(() => {
    if (phase) {
      reset({
        id: phase.id,
        title: phase.title,
        description: phase.description,
        rewardPoints: phase.rewardPoints,
        duration: phase.duration,
        isActive: phase.isActive,
        allowedRoles: (phase.allowedRoles ?? []).filter(
          (r): r is "SUPERADMIN" | "ADMIN" | "MENTOR" | "CASHIER" =>
            ["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"].includes(r)
        ),
      });
    } else {
      reset({
        id: undefined,
        title: "",
        description: "",
        rewardPoints: 0,
        duration: 60,
        isActive: false,
        allowedRoles: ["SUPERADMIN", "ADMIN", "CASHIER"],
      });
    }
  }, [phase, reset]);

  const submitHandler = async (data: GamePhaseFormValues & { id?: string }) => {
    await onSubmit(data);
    reset();
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        {phase ? "ویرایش مرحله" : "ایجاد مرحله جدید"}
      </h2>
      <input type="hidden" {...register("id")} />

      <Input
        label="عنوان"
        placeholder="عنوان"
        {...register("title")}
        error={errors.title}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-white">
          توضیحات
        </label>
        <textarea
          {...register("description")}
          placeholder="توضیحات مرحله"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00] ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="امتیاز"
        type="number"
        {...register("rewardPoints", { valueAsNumber: true })}
        placeholder="مثلا: 100"
        error={errors.rewardPoints}
      />

      <Input
        label="مدت زمان (دقیقه)"
        type="number"
        {...register("duration", { valueAsNumber: true })}
        placeholder="مثلا: 60"
        error={errors.duration}
      />

      <PrettyMultiSelect
        label="نقش‌های مجاز برای دادن امتیاز"
        options={[
          { value: "SUPERADMIN", label: "مدیر سیستم" },
          { value: "ADMIN", label: "مدیر" },
          { value: "MENTOR", label: "منتور" },
          { value: "CASHIER", label: "صندوق‌دار" },
        ]}
        value={field.value || []}
        onChange={field.onChange}
      />

      <div className="flex justify-end gap-2">
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            لغو
          </Button>
        )}
        <Button type="submit" className="bg-[#ff5f00] hover:bg-[#e35500]">
          {phase ? "بروزرسانی" : "ایجاد"}
        </Button>
      </div>
    </form>
  );
};

export default GamePhaseForm;
