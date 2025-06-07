"use client";

import { Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

interface Props {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: Props) {
  return (
    <header className="h-16 bg-gradient-to-b from-white to-[#f8f9fa] border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shadow-md sticky top-0 z-50 font-iranYekan backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-[#ff5f00] hover:bg-[#ff5f0020] hover:text-[#d04b00] p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
          aria-label="نمایش منو"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-[18px] sm:text-xl font-extrabold text-[#00092c] tracking-tight">
          داشبورد مدیریت بازی
        </h1>
      </div>

      <ProfileMenu />
    </header>
  );
}
