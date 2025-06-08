import Image from "next/image";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white px-4 py-6 rtl font-iranYekan">
      <header className="flex flex-col items-center justify-center gap-2 mb-6">
        <Image
          src="/images/sarnakh.jpg"
          alt="لوگو"
          width={70}
          height={70}
          className="rounded-full shadow-md border-2 border-orange-500"
        />
        <h1 className="text-2xl font-extrabold text-orange-400 tracking-tight drop-shadow">
          👑 جدول برترین تیم‌ها
        </h1>
        <p className="text-sm text-gray-300">🏁 رقابت تنگاتنگ، امتیاز طلایی</p>
      </header>

      <main className="max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}
