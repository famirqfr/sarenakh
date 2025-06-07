"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function SidebarLink({
  label,
  href,
  icon: Icon,
  onClick,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "relative flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all group",
        isActive
          ? "bg-[#ff5f00] text-white shadow-inner"
          : "hover:bg-white/10 text-white/80 hover:text-white"
      )}
    >
      <Icon size={18} className="text-white" />
      <span className="flex-1">{label}</span>

      {isActive && (
        <span className="absolute right-0 top-0 bottom-0 w-1 rounded-l bg-white" />
      )}
    </Link>
  );
}
