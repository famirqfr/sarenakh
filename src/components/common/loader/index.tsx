"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#00092c] text-white flex items-center justify-center flex-col space-y-10 font-iranYekan">
      {/* دایره مرکزی با عنوان */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-[#ff5f00] animate-glow z-10">
          سرنخ
        </h1>

        {/* مدار چرخشی */}
        <div className="absolute inset-0 animate-rotate-center">
          <div className="relative w-full h-full">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff5f00] rounded-full shadow-lg"></span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff5f00] rounded-full shadow-md"></span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-300 animate-fade">
        در حال بارگذاری اطلاعات...
      </p>
    </div>
  );
}
