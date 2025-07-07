import React from "react";

interface CardProps {
  children: React.ReactNode;
  classname?: string;
  title?: string;
}

export default function Card({ children, classname = "", title }: CardProps) {
  return (
    <div className={`${classname} rounded-lg shadow-[2px_2px_10px_rgba(0,0,0,0.1)]`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
