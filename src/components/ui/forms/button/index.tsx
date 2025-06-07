import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disable?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disable = false,
  loading = false,
}: ButtonProps) {
  // انتخاب کلاس cursor بر اساس وضعیت
  const cursorClass = disable
    ? "cursor-not-allowed"
    : loading
    ? "cursor-wait"
    : "cursor-pointer";

  return (
    <button
      type={type}
      disabled={disable || loading}
      onClick={onClick}
      className={`bg-[#ff5f00] text-[#eeeeee] hover:bg-[#cc4e00] transition-colors duration-200 rounded-lg px-4 py-2 font-medium shadow-sm flex items-center justify-center gap-2 ${className} ${
        disable || loading ? "opacity-50" : ""
      } ${cursorClass}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? "در حال انجام..." : children}
    </button>
  );
}
