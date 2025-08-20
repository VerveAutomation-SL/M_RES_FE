import React from "react";

interface CardProps {
  children: React.ReactNode;
  classname?: string;
  title?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  classname = "",
  title,
  onClick,
}: CardProps) {
  return (
    <div className={`${classname} rounded-lg shadow-md`} onClick={onClick}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
