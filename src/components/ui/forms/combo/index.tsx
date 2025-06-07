import { useState } from "react";

interface ComboBoxProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export default function ComboBox({
  label,
  value,
  onChange,
  options,
}: ComboBoxProps) {
  const [filtered, setFiltered] = useState(options);

  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setFiltered(
            options.filter((opt) =>
              opt.toLowerCase().includes(e.target.value.toLowerCase())
            )
          );
        }}
        className="w-full px-4 py-2 border rounded-md"
        list="combo-options"
      />
      <datalist id="combo-options">
        {filtered.map((opt, i) => (
          <option key={i} value={opt} />
        ))}
      </datalist>
    </div>
  );
}
