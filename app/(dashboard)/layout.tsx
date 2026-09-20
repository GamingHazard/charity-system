"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import type { Permission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, can } = useAuth();
  const pathname = usePathname();
  const isProduction = process.env.NODE_ENV === "production";
  const [isDesktop, setIsDesktop] = useState<boolean | null>(
    isProduction ? null : true,
  );

  useEffect(() => {
    if (!isProduction) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, [isProduction]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  const routePermissions: Array<{
    prefix: string;
    permission: Permission;
  }> = [
    { prefix: "/dashboard/children", permission: "children.view" },
    { prefix: "/dashboard/sponsorships", permission: "sponsorships.view" },
    { prefix: "/dashboard/staff", permission: "staff.view" },
    { prefix: "/dashboard/blogs", permission: "blogs.view" },
    { prefix: "/dashboard/events", permission: "events.view" },
    { prefix: "/dashboard/gallery", permission: "gallery.view" },
    { prefix: "/dashboard/content", permission: "content.view" },
  ];
  const requiredPermission = routePermissions.find(({ prefix }) =>
    pathname.startsWith(prefix),
  )?.permission;

  if (requiredPermission && !can(requiredPermission)) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 text-foreground">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center text-center">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Access denied</h1>
            <p className="mt-3 text-foreground/70">
              Your account does not have permission to view this dashboard
              section.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isDesktop === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/70">Checking device size...</p>
        </div>
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 text-foreground">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center text-center">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-bold">
              Dashboard not supported on small devices
            </h1>
            <p className="mt-3 text-foreground/70">
              Please use a laptop or desktop computer with a larger screen to
              access the dashboard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
