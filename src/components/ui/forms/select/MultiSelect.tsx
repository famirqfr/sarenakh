import { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

interface Props {
  label?: string;
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

const PrettyMultiSelect: React.FC<Props> = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // بستن لیست وقتی بیرون کلیک شد
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border rounded-md px-3 py-2 flex flex-wrap gap-2 min-h-[42px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
      >
        {value.length === 0 && <span className="text-gray-400">{placeholder ?? "انتخاب کنید..."}</span>}
        {value.map(val => {
          const option = options.find(o => o.value === val);
          return (
            <span
              key={val}
              className="bg-[#ff5f00] text-white px-2 py-1 rounded-full flex items-center gap-1"
            >
              {option?.label}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleOption(val); }}
                className="ml-1 text-xs"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      {isOpen && (
        <div className="absolute w-full border rounded-md mt-1 bg-white shadow-md z-10 max-h-60 overflow-auto">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              className={`px-4 py-2 cursor-pointer hover:bg-orange-100 ${
                value.includes(opt.value) ? "bg-orange-200" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrettyMultiSelect;
