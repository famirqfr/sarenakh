"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import Select from "@/components/ui/forms/select";
import axios from "axios";

const memberSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "حداقل ۲ حرف"),
  lastName: z.string().min(2, "حداقل ۲ حرف"),
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن نامعتبر"),
  age: z.number().min(1, "سن معتبر نیست"),
  relation: z.string().min(2, "رابطه را انتخاب کنید"),
});

const formSchema = z.object({
  name: z.string().optional(),
  points: z.number().optional(),
  leader: memberSchema.omit({ relation: true }),
  members: z.array(memberSchema),
});

type FormData = z.infer<typeof formSchema>;

export default function TeamForm({
  defaultValues,
  onSubmitHandler,
  submitLabel = "ثبت",
  onCancel,
  isEditMode,
}: {
  defaultValues?: FormData;
  onSubmitHandler: (data: FormData) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
  isEditMode?: boolean;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      leader: { firstName: "", lastName: "", phone: "", age: 18 },
      members: [
        { firstName: "", lastName: "", phone: "", age: 18, relation: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSubmitHandler(data);
      toast.success("عملیات موفق بود");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.error || "خطا در عملیات");
      } else {
        toast.error("خطای ناشناخته");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        console.error("Form validation errors:", formErrors);
        toast.error("خطا در فرم. لطفاً مقادیر را بررسی کنید.");
      })}
      className="space-y-8"
    >
      {isEditMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="نام تیم" {...register("name")} error={errors.name} />

          <Input
            label="امتیاز"
            type="number"
            {...register("points", { valueAsNumber: true })}
            error={errors.points}
          />
        </div>
      )}

      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
        👤 سرگروه
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="نام"
          {...register("leader.firstName")}
          error={errors.leader?.firstName}
        />
        <Input
          label="نام خانوادگی"
          {...register("leader.lastName")}
          error={errors.leader?.lastName}
        />
        <Input
          label="شماره تماس"
          {...register("leader.phone")}
          error={errors.leader?.phone}
        />
        <Input
          label="سن"
          type="number"
          {...register("leader.age", { valueAsNumber: true })}
          error={errors.leader?.age}
        />
      </div>

      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
        👥 اعضای تیم
      </h3>
      {fields.map((member, index) => (
        <div key={member.id} className="border p-3 rounded mb-2 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام"
              {...register(`members.${index}.firstName`)}
              error={errors.members?.[index]?.firstName}
            />
            <Input
              label="نام خانوادگی"
              {...register(`members.${index}.lastName`)}
              error={errors.members?.[index]?.lastName}
            />
            <Input
              label="شماره تماس"
              {...register(`members.${index}.phone`)}
              error={errors.members?.[index]?.phone}
            />
            <Input
              label="سن"
              type="number"
              {...register(`members.${index}.age`, { valueAsNumber: true })}
              error={errors.members?.[index]?.age}
            />
            <Select
              label="رابطه"
              {...register(`members.${index}.relation`)}
              error={errors.members?.[index]?.relation}
              options={[
                { label: "پدر", value: "father" },
                { label: "مادر", value: "mother" },
                { label: "برادر", value: "brother" },
                { label: "خواهر", value: "sister" },
                { label: "دوست", value: "friend" },
                { label: "فامیل", value: "family" },
              ]}
            />
          </div>
          {fields.length > 1 && (
            <Button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 border border-red-200 dark:border-red-500"
            >
              حذف عضو
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          append({
            firstName: "",
            lastName: "",
            phone: "",
            age: 18,
            relation: "",
          })
        }
      >
        + افزودن عضو جدید
      </Button>

      <div className="flex gap-4">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="bg-red-500 text-white"
          >
            لغو
          </Button>
        )}
      </div>
    </form>
  );
}
