"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import { loginSchema, LoginSchema } from "../schemas/loginSchema";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await axiosInstance.post("/api/auth/login", data);

      const { data: user } = await axiosInstance.get("/api/auth/me");
      setUser(user);

      toast.success("ورود با موفقیت انجام شد 🎉", {
        icon: "✅",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { error?: string } };
          message?: string;
        };

        toast.error(
          axiosError.response?.data?.error ||
            axiosError.message ||
            "خطای ناشناخته‌ای رخ داد",
          { icon: "❌" }
        );
      } else {
        toast.error("خطای ناشناخته‌ای رخ داد", { icon: "❌" });
      }
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="شماره موبایل"
        type="tel"
        {...register("phone")}
        error={errors.phone}
      />

      <Button
        type="submit"
        disable={isSubmitting}
        className="w-full rounded-lg font-semibold transition disabled:opacity-60"
      >
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </Button>
    </form>
  );
}
