import { z } from "zod";

export const gamePhaseForm = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "عنوان اجباری است"),
  description: z.string().min(1, "توضیحات اجباری است"),
  rewardPoints: z.number().min(0, "امتیاز باید مثبت باشد"),
  duration: z.number().min(1, "مدت زمان باید حداقل 1 دقیقه باشد"),
  isActive: z.boolean(),
  allowedRoles: z
    .array(z.enum(["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]))
    .min(1, "حداقل یک نقش انتخاب کنید"),
});

export type GamePhaseFormValues = z.infer<typeof gamePhaseForm>;
