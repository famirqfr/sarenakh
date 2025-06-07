export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] px-4 font-iranYekan">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2">
        <div className="p-10 space-y-6 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-[#00092c] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5f00] inline-block"></span>
            ورود به حساب
          </h1>
          <p className="text-sm text-gray-600">
            خوش برگشتی! لطفاً اطلاعاتت رو وارد کن.
          </p>
          {children}
        </div>

        <div className="hidden md:flex bg-gradient-to-br from-[#00092c] to-[#1a1a40] relative text-center justify-center items-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-[#ff5f00] font-extrabold text-6xl">سرنخ</p>
            <p className="text-[#eee] ">غدیر 1404</p>
          </div>
        </div>
      </div>
    </div>
  );
}
