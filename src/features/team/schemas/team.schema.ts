import { z } from "zod";

export const teamSchema = z.object({
  leader: z.object({
    firstName: z.string().min(2, "حداقل ۲ حرف"),
    lastName: z.string().min(2, "حداقل ۲ حرف"),
    phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
  }),
  members: z
    .array(
      z.object({
        firstName: z.string().min(2, "حداقل ۲ حرف"),
        lastName: z.string().min(2, "حداقل ۲ حرف"),
        phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
        age: z.number().min(7, "سن معتبر نیست"),
        relation: z.string().nonempty("رابطه را انتخاب کنید"),
      })
    )
    .min(1, "حداقل یک عضو نیاز است"),
});

export const formSchema = z.object({
  name: z.string().optional(),
  points: z.number().optional(),
  leader: z.object({
    id: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().regex(/^09\d{9}$/),
    age: z.number().min(1),
  }),
  members: z.array(
    z.object({
      id: z.string().optional(),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string().regex(/^09\d{9}$/),
      age: z.number().min(1),
      relation: z.string().min(2),
    })
  ),
});

export type FormData = z.infer<typeof formSchema>;
