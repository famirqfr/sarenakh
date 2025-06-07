interface SwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export default function Switch({ enabled, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full flex items-center transition ${
        enabled ? "bg-[#ff5f00]" : "bg-gray-300"
      }`}
    >
      <span
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      ></span>
    </button>
  );
}
