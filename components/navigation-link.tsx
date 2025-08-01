"use client";

import type { LinkProps } from "next/link";
import type { JSX } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useNavigation } from "@/components/providers/navigation-provider";



type TNavigationLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

/**
 * @description
 * Custom Link component that triggers navigation loading state
 * Wraps Next.js Link with navigation context integration
 *
 * @param props - The link props
 * @param props.children - The child elements to render inside the link
 * @param props.className - Optional CSS class name
 * @returns The navigation link component
 */
export function NavigationLink({ children, className, ...linkProps }: TNavigationLinkProps): JSX.Element {
  const { startNavigation } = useNavigation();
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetHref = typeof linkProps.href === "string" ? linkProps.href : linkProps.href.pathname || "";

    if (targetHref !== pathname) {
      startNavigation();
    }

    if (linkProps.onClick) {
      linkProps.onClick(event);
    }
  };

  return (
    <Link
      {...linkProps}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
