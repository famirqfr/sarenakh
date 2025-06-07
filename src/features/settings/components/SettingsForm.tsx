"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/forms/button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  getHelpCosts,
  getInitialTeamPoints,
  updateHelpCosts,
  updateInitialTeamPoints,
} from "../api/settingsApi";
import { AxiosError } from "axios";
import { CircleDollarSign, ClipboardPen, HeartHandshake } from "lucide-react";

type FormFields = {
  points: string;
  simpleCost: string;
  professionalCost: string;
  specialCost: string;
  boxCost: string;
};

export default function SettingsForm() {
  const { user } = useAuth();
  const isAllowed = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormFields>({
    points: "",
    simpleCost: "",
    professionalCost: "",
    specialCost: "",
    boxCost: "",
  });
  const [initialForm, setInitialForm] = useState<FormFields>(form);

  useEffect(() => {
    if (!isAllowed) return;

    const fetchSettings = async () => {
      try {
        const [pointsValue, helpCosts] = await Promise.all([
          getInitialTeamPoints(),
          getHelpCosts(),
        ]);
        const fetchedForm: FormFields = {
          points: String(pointsValue ?? ""),
          simpleCost: String(helpCosts.simple ?? ""),
          professionalCost: String(helpCosts.professional ?? ""),
          specialCost: String(helpCosts.special ?? ""),
          boxCost: String(helpCosts.box ?? ""),
        };
        setForm(fetchedForm);
        setInitialForm(fetchedForm);
      } catch {
        toast.error("خطا در دریافت تنظیمات");
      }
    };

    fetchSettings();
  }, [isAllowed]);

  const handleChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    const { points, simpleCost, professionalCost, specialCost, boxCost } = form;
    if (
      [points, simpleCost, professionalCost, specialCost, boxCost].some(
        (val) => !val || isNaN(Number(val))
      )
    ) {
      toast.error("لطفاً مقادیر معتبر وارد کنید");
      return;
    }

    setLoading(true);
    try {
      await Promise.all([
        updateInitialTeamPoints(points),
        updateHelpCosts({
          simple: simpleCost,
          professional: professionalCost,
          special: specialCost,
          box: boxCost,
        }),
      ]);
      setInitialForm(form);
      toast.success("تنظیمات ذخیره شد");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("خطا در ذخیره تنظیمات");
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    (Object.keys(form) as (keyof FormFields)[]).every(
      (key) => form[key] === initialForm[key]
    );

  if (!isAllowed) {
    return (
      <div className="text-sm text-red-500 border border-red-200 bg-red-50 p-4 rounded-lg">
        شما دسترسی لازم برای مشاهده این بخش را ندارید.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        تنظیمات بازی
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold">
            <ClipboardPen size={20} /> امتیاز ثبت‌نام
          </h3>
          <Input
            label="امتیاز اولیه تیم"
            value={form.points}
            onChange={handleChange("points")}
            type="number"
            min={0}
            inputExtra="bg-white"
          />
        </div>

        <div className="space-y-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold">
            <HeartHandshake size={20} /> هزینه‌های راهنمایی
          </h3>
          <Input
            label="هزینه سوال ساده (امتیاز)"
            value={form.simpleCost}
            onChange={handleChange("simpleCost")}
            type="number"
            min={0}
            inputExtra="bg-white"
          />
          <Input
            label="هزینه سوال حرفه‌ای (امتیاز)"
            value={form.professionalCost}
            onChange={handleChange("professionalCost")}
            type="number"
            min={0}
            inputExtra="bg-white"
          />
          <Input
            label="هزینه سوال ویژه (امتیاز)"
            value={form.specialCost}
            onChange={handleChange("specialCost")}
            type="number"
            inputExtra="bg-white"
            min={0}
          />
        </div>

        <div className="space-y-2 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 font-semibold">
            <CircleDollarSign size={20} /> هزینه صندوق
          </h3>
          <Input
            label="هزینه مراجعه به صندوق (امتیاز)"
            value={form.boxCost}
            onChange={handleChange("boxCost")}
            type="number"
            min={0}
            inputExtra="bg-white"
          />
        </div>
      </div>

      <Button type="button" disable={isDisabled} onClick={handleSubmit}>
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </div>
  );
}
