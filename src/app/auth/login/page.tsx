"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

type Step = "PHONE" | "OTP";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("PHONE");
  const [phone, setPhone] = useState("");
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ phone: string; otp: string }>();

  const onSubmit = async (data: { phone: string; otp?: string }) => {
    try {
      if (step === "PHONE") {
        await axiosInstance.post("/api/auth/send-otp", { phone: data.phone });

        toast.success("کد تایید ارسال شد ✅");
        setPhone(data.phone);
        setStep("OTP");
        reset({ phone: data.phone });
      } else {
        await axiosInstance.post("/api/auth/verify-otp", {
          phone,
          otp: data.otp,
        });

        const { data: user } = await axiosInstance.get("/api/auth/me");
        setUser(user);

        toast.success("ورود با موفقیت انجام شد 🎉", {
          icon: "✅",
        });

        router.push("/dashboard");
      }
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {step === "PHONE" && (
        <Input
          label="شماره موبایل"
          type="tel"
          {...register("phone")}
          error={errors.phone}
        />
      )}

      {step === "OTP" && (
        <>
          <div className="text-sm text-center text-gray-600">
            کد تایید به شماره{" "}
            <span className="font-semibold text-orange-500">{phone}</span> ارسال
            شد.
          </div>
          <Input
            label="کد تایید"
            type="text"
            maxLength={6}
            {...register("otp")}
            error={errors.otp}
          />
        </>
      )}

      <Button
        type="submit"
        disable={isSubmitting}
        className="w-full rounded-lg font-semibold transition disabled:opacity-60"
      >
        {isSubmitting
          ? step === "PHONE"
            ? "در حال ارسال کد..."
            : "در حال ورود..."
          : step === "PHONE"
          ? "ارسال کد تایید"
          : "تایید کد و ورود"}
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/board"
          className="text-sm text-orange-500 hover:text-orange-300 transition-colors underline underline-offset-4"
        >
          👑 مشاهده جدول برترین تیم‌ها
        </Link>
      </div>
    </form>
  );
}
