import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  extra?: string;
  inputExtra?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, extra, inputExtra, ...rest }, ref) => {
    return (
      <div className={`w-full space-y-1 ${extra}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          autoComplete="off"
          ref={ref}
          {...rest}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00] ${inputExtra} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <span className="text-sm text-red-600">{error.message}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
