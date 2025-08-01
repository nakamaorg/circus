import type { JSX } from "react";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";



type TBreadcrumbItem = {
  label: string;
  href?: string;
};

type TBreadcrumbProps = {
  items: TBreadcrumbItem[];
};

/**
 * @description
 * Breadcrumb navigation component
 *
 * @param props - The component props
 * @param props.items - Array of breadcrumb items
 * @returns The breadcrumb component
 */
export function Breadcrumb({ items }: TBreadcrumbProps): JSX.Element {
  return (
    <nav className="flex items-center space-x-2 text-sm font-bold">
      <Link
        href="/"
        className="flex items-center text-black hover:text-pink-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-black/50" />
          {item.href
            ? (
                <Link
                  href={item.href}
                  className="text-black hover:text-pink-600 transition-colors uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              )
            : (
                <span className="text-black uppercase tracking-wide">
                  {item.label}
                </span>
              )}
        </div>
      ))}
    </nav>
  );
}
