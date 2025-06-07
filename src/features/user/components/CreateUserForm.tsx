"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { createUser, updateUser } from "../services/userApi";
import { UserFormData, userSchema } from "../schemas/user.schema";
import { Role } from "../types/user";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/forms/input";
import Select from "@/components/ui/forms/select";
import Button from "@/components/ui/forms/button";
import { AxiosError } from "axios";

interface Props {
  mode?: "create" | "edit";
  defaultValues?: Partial<UserFormData>;
  onSuccess?: () => void;
}

type Option = {
  label: string;
  value: string;
};

const CreateUserForm = ({
  onSuccess,
  defaultValues,
  mode = "create",
}: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const allowedRoles: Role[] =
    user?.role === "SUPERADMIN"
      ? ["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]
      : ["MENTOR", "CASHIER"];

  const roleOptions: Option[] = allowedRoles.map((r) => ({
    value: r, // انگلیسی برای ذخیره‌سازی
    label:
      r === "SUPERADMIN"
        ? "سوپر ادمین"
        : r === "ADMIN"
        ? "ادمین"
        : r === "MENTOR"
        ? "منتور"
        : r === "CASHIER"
        ? "صندوقدار"
        : r,
  }));

  const mentorTypeOptions: Option[] = [
    { label: "خوب", value: "GOOD" },
    { label: "بد", value: "BAD" },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      role: "MENTOR",
      mentorType: "GOOD",
      ...defaultValues,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    const toastId = toast.loading(
      mode === "create" ? "در حال ثبت کاربر..." : "در حال ویرایش کاربر..."
    );

    try {
      if (mode === "create") {
        await createUser(data);
      } else {
        await updateUser(data);
      }

      toast.success(
        mode === "create"
          ? "کاربر با موفقیت ثبت شد"
          : "ویرایش با موفقیت انجام شد",
        { id: toastId }
      );
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      let message =
        mode === "create"
          ? "خطایی در ثبت کاربر رخ داد."
          : "خطایی در ویرایش کاربر رخ داد.";

      if (err instanceof AxiosError && err.response?.data?.error) {
        message = err.response.data.error;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto bg-white text-right dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 space-y-5"
    >
      <Input label="نام" {...register("firstName")} error={errors.firstName} />
      <Input
        label="نام خانوادگی"
        {...register("lastName")}
        error={errors.lastName}
      />
      <Input label="شماره تلفن" {...register("phone")} error={errors.phone} />

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Select
            label="نقش"
            {...field}
            options={roleOptions}
            error={errors.role}
          />
        )}
      />

      {selectedRole === "MENTOR" && (
        <Controller
          control={control}
          name="mentorType"
          render={({ field }) => (
            <Select
              label="نوع منتور"
              {...field}
              options={mentorTypeOptions}
              error={errors.mentorType}
            />
          )}
        />
      )}

      <Button
        type="submit"
        className="w-full bg-[#ff5f00] hover:bg-[#e35500] text-white font-semibold rounded-md py-2 transition duration-150 flex justify-center items-center"
        disable={loading}
      >
        {loading
          ? mode === "create"
            ? "در حال ارسال..."
            : "در حال ویرایش..."
          : mode === "create"
          ? "ثبت کاربر"
          : "ویرایش کاربر"}
      </Button>
    </form>
  );
};

export default CreateUserForm;
