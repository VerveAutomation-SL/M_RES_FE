import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  type,
  children,
  disabled,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
