import { LucideIcon } from "lucide-react";
import React from "react";

interface InputProps {
  type: "text" | "password";
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: LucideIcon;
  required: boolean;
  disabled?: boolean;
  className?: string;
}

const AuthInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required,
  disabled,
  className,
}: InputProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-[#8B6F47] opacity-70" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={className}
      />
    </div>
  );
};

export default AuthInput;
