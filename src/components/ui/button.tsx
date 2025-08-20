import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: string;
  size?: string;
  name?: string;
  value?: string;
}

const Button = ({
  type,
  children,
  disabled,
  onClick,
  className,
  variant,
  size,
  name,
  value,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${variant}`}
      data-size={size}
      name={name}
      value={value}
    >
      {children}
    </button>
  );
};

export default Button;
