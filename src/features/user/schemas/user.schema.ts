import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "حداقل ۲ حرف لازم است"),
  lastName: z.string().min(2, "حداقل ۲ حرف لازم است"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره تلفن معتبر نیست")
    .min(11, "شماره کامل نیست"),
  role: z.enum(["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]),
  mentorType: z.enum(["GOOD", "BAD"]).optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
