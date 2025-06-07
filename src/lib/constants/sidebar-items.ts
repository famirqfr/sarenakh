import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Flag,
  CircleDollarSign,
  LucideIcon,
  Boxes,
  Settings,
  FileText,
} from "lucide-react";

type Role = "SUPERADMIN" | "ADMIN" | "MENTOR" | "CASHIER";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarItems: Record<Role, SidebarItem[]> = {
  SUPERADMIN: [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
    { label: "مدیریت کاربران", href: "/dashboard/users", icon: Users },
    {
      label: "مدیریت تیم‌ها",
      href: "/dashboard/teams",
      icon: Boxes,
    },
    {
      label: "راهنمایی‌ها",
      href: "/dashboard/mentoring",
      icon: HeartHandshake,
    },
    { label: "صندوق‌", href: "/dashboard/cashiers", icon: CircleDollarSign },
    { label: "مراحل بازی", href: "/dashboard/phases", icon: Flag },
    { label: "تنظیمات بازی", href: "/dashboard/setting", icon: Settings },
    {
      label: "گزارش‌ها سیستمی",
      href: "/dashboard/logs",
      icon: FileText,
    },
  ],
  ADMIN: [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "راهنمایی‌ها",
      href: "/dashboard/mentoring",
      icon: HeartHandshake,
    },
    { label: "صندوق‌", href: "/dashboard/cashiers", icon: CircleDollarSign },
  ],
  MENTOR: [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "راهنمایی‌ها",
      href: "/dashboard/mentoring",
      icon: HeartHandshake,
    },
    { label: "صندوق‌", href: "/dashboard/cashiers", icon: CircleDollarSign },
  ],
  CASHIER: [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
    { label: "صندوق‌", href: "/dashboard/cashiers", icon: CircleDollarSign },
  ],
};
