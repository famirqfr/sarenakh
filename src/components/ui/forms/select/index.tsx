import { forwardRef, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError;
  extra?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, extra, options, ...rest }, ref) => {
    return (
      <div className={`w-full space-y-1 ${extra}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          {...rest}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00] ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">لطفاً انتخاب کنید</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-600">{error.message}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
