import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(11, "شماره موبایل باید ۱۱ رقم باشد")
    .regex(/^09\d{9}$/, "فرمت شماره موبایل معتبر نیست"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
