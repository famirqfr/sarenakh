import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "سامانه مدیریت بازی فیزیکی",
  description: "پلتفرم مدیریت منتورها، تیم‌ها و مراحل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50 text-gray-900 font-iranYekan">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "IranYekan",
              fontSize: "14px",
              direction: "rtl",
            },
          }}
        />
      </body>
    </html>
  );
}
