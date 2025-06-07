"use client";

import { sidebarItems } from "@/lib/constants/sidebar-items";
import { X } from "lucide-react";
import SidebarLink from "./SidebarLink";
import { useAuth } from "@/context/AuthContext";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: Props) {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  const items = sidebarItems[user.role];

  return (
    <aside
      className={`fixed md:static z-40 top-0 right-0 h-screen py-5 w-64 transform transition-transform duration-300
    bg-gradient-to-br from-[#00092c] to-[#1a1a40] text-white shadow-2xl
    ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        {onClose && (
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#ff5f00] transition cursor-pointer"
              aria-label="بستن منو"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="text-center space-y-2 px-4">
          <h2 className="text-3xl font-extrabold text-[#ff5f00] tracking-tight">
            سرنخ
          </h2>
        </div>

        {/* بخش اسکرولی */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 mt-6">
          <nav className="space-y-2">
            {items.map((item) => (
              <SidebarLink
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                onClick={onClose}
              />
            ))}
          </nav>
        </div>

        <div className="text-xs text-center text-white/40 pt-6 border-t border-white/10 px-4">
          نسخه 1.0.0 - غدیر 1404.
        </div>
      </div>
    </aside>
  );
}
