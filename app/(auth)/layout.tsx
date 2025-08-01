import type { JSX } from "react";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { auth } from "@/lib/helpers/auth.helper";



/**
 * @description
 * Layout for authenticated pages
 *
 * @param props - The layout props
 * @param props.children - The page content
 * @returns The authenticated layout
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}
