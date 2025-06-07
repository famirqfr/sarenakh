"use client";

import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      router.push("/auth/login");
    } catch (err) {
      console.error("خطا در خروج", err);
    }
  };

  if (loading || !user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = user.firstName[0] + (user.lastName?.[0] || "");

  return (
    <HeadlessMenu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 outline-none focus:ring-2 focus:ring-[#ff5f00] rounded-full transition cursor-pointer">
        <div className="w-9 h-9 bg-[#ff5f00] text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
          {initials}
        </div>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems className="absolute left-0 mt-3 w-56 origin-top-left bg-white/90 backdrop-blur-md rounded-xl shadow-xl ring-1 ring-black/10 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-[#00092c]">{fullName}</p>
            <p className="text-xs text-gray-500">
              {user.role === "SUPERADMIN" ? "سوپرادمین" : "کاربر"}
            </p>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <a
                  href="/dashboard/profile"
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  <User size={16} className="text-[#00092c]" />
                  <span className="text-[#00092c]">پروفایل</span>
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition cursor-pointer ${
                    active ? "bg-red-50" : ""
                  } text-red-600`}
                >
                  <LogOut size={16} /> خروج
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </HeadlessMenu>
  );
}
