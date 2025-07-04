"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  count?: number;
}

interface TabsProps {
  items: NavItem[];
  className?: string;
}

export default function Tabs({ items, className }: TabsProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex border-b border-gray-200", className)}>
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap",
              isActive
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-600 hover:text-amber-600 hover:border-b-2 hover:border-amber-200"
            )}
          >
            {item.name}
            {item.count !== undefined && (
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  isActive
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
